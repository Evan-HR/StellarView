from qgis.core import QgsProcessing
from qgis.core import QgsProcessingAlgorithm
from qgis.core import QgsProcessingMultiStepFeedback
from qgis.core import QgsProcessingParameterString
from qgis.core import QgsProcessingParameterRasterLayer
from qgis.core import QgsProcessingParameterFeatureSink
import processing


class Osm(QgsProcessingAlgorithm):

    def initAlgorithm(self, config=None):
        self.addParameter(QgsProcessingParameterString('inputarea', 'Input Area', multiLine=False, defaultValue='hamilton'))
        self.addParameter(QgsProcessingParameterString('inputkeytype', 'Input Key Type', multiLine=False, defaultValue='leisure'))
        self.addParameter(QgsProcessingParameterString('inputvaluetype', 'Input Value Type', multiLine=False, defaultValue='park'))
        self.addParameter(QgsProcessingParameterRasterLayer('lightmap', 'LightMap', defaultValue=None))
        self.addParameter(QgsProcessingParameterRasterLayer('lightmap2', 'LightMap2', optional=True, defaultValue=None))
        self.addParameter(QgsProcessingParameterRasterLayer('lightmap3', 'LightMap3', optional=True, defaultValue=None))
        self.addParameter(QgsProcessingParameterFeatureSink('Outputfinal2', 'OutputFinal2', type=QgsProcessing.TypeVectorAnyGeometry, createByDefault=True, defaultValue=None))

    def processAlgorithm(self, parameters, context, model_feedback):
        # Use a multi-step feedback, so that individual child algorithm progress reports are adjusted for the
        # overall progress through the model
        feedback = QgsProcessingMultiStepFeedback(18, model_feedback)
        results = {}
        outputs = {}

        # Build query inside an area
        alg_params = {
            'AREA': parameters['inputarea'],
            'KEY': parameters['inputkeytype'],
            'SERVER': 'http://www.overpass-api.de/api/interpreter',
            'TIMEOUT': 999,
            'VALUE': parameters['inputvaluetype']
        }
        outputs['BuildQueryInsideAnArea'] = processing.run('quickosm:buildqueryinsidearea', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(1)
        if feedback.isCanceled():
            return {}

        # Build virtual raster
        alg_params = {
            'ADD_ALPHA': False,
            'ASSIGN_CRS': None,
            'INPUT': [parameters['lightmap'],parameters['lightmap2'],parameters['lightmap3']],
            'PROJ_DIFFERENCE': False,
            'RESAMPLING': 0,
            'RESOLUTION': 0,
            'SEPARATE': False,
            'SRC_NODATA': '',
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['BuildVirtualRaster'] = processing.run('gdal:buildvirtualraster', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(2)
        if feedback.isCanceled():
            return {}

        # Download file
        alg_params = {
            'URL': outputs['BuildQueryInsideAnArea']['OUTPUT_URL'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['DownloadFile'] = processing.run('native:filedownloader', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(3)
        if feedback.isCanceled():
            return {}

        # String concatenation - Multipolygon
        alg_params = {
            'INPUT_1': outputs['DownloadFile']['OUTPUT'],
            'INPUT_2': '|layername=multipolygons'
        }
        outputs['StringConcatenationMultipolygon'] = processing.run('native:stringconcatenation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(4)
        if feedback.isCanceled():
            return {}

        # Fix geometries
        alg_params = {
            'INPUT': outputs['StringConcatenationMultipolygon']['CONCATENATION'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['FixGeometries'] = processing.run('native:fixgeometries', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(5)
        if feedback.isCanceled():
            return {}

        # String concatenation - Points
        alg_params = {
            'INPUT_1': outputs['DownloadFile']['OUTPUT'],
            'INPUT_2': '|layername=points'
        }
        outputs['StringConcatenationPoints'] = processing.run('native:stringconcatenation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(6)
        if feedback.isCanceled():
            return {}

        # Explode HStore Field
        alg_params = {
            'EXPECTED_FIELDS': '',
            'FIELD': 'other_tags',
            'INPUT': outputs['FixGeometries']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['ExplodeHstoreField'] = processing.run('native:explodehstorefield', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(7)
        if feedback.isCanceled():
            return {}

        # Fix geometries
        alg_params = {
            'INPUT': outputs['StringConcatenationPoints']['CONCATENATION'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['FixGeometries'] = processing.run('native:fixgeometries', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(8)
        if feedback.isCanceled():
            return {}

        # Refactor fields
        alg_params = {
            'FIELDS_MAPPING': [{'expression': 'if("osm_way_id" is NULL, -1, "osm_way_id")', 'length': 0, 'name': 'osm_id', 'precision': 0, 'type': 10}, {'expression': ' if( "name" is NULL, \'Unknown\', "name")', 'length': 0, 'name': 'name', 'precision': 0, 'type': 10}, {'expression': "concat(@inputkeytype,'-', @inputvaluetype )", 'length': 0, 'name': 'type', 'precision': 0, 'type': 10}],
            'INPUT': outputs['ExplodeHstoreField']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['RefactorFields'] = processing.run('qgis:refactorfields', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(9)
        if feedback.isCanceled():
            return {}

        # Zonal statistics
        alg_params = {
            'COLUMN_PREFIX': 'light_pol',
            'INPUT_RASTER': outputs['BuildVirtualRaster']['OUTPUT'],
            'INPUT_VECTOR': outputs['RefactorFields']['OUTPUT'],
            'RASTER_BAND': 1,
            'STATS': 2
        }
        outputs['ZonalStatistics'] = processing.run('qgis:zonalstatistics', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(10)
        if feedback.isCanceled():
            return {}

        # Centroids
        alg_params = {
            'ALL_PARTS': False,
            'INPUT': outputs['ZonalStatistics']['INPUT_VECTOR'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['Centroids'] = processing.run('native:centroids', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(11)
        if feedback.isCanceled():
            return {}

        # Explode HStore Field
        alg_params = {
            'EXPECTED_FIELDS': '',
            'FIELD': 'other_tags',
            'INPUT': outputs['FixGeometries']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['ExplodeHstoreField'] = processing.run('native:explodehstorefield', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(12)
        if feedback.isCanceled():
            return {}

        # Refactor fields
        alg_params = {
            'FIELDS_MAPPING': [{'expression': 'if("osm_id" is NULL, -1, "osm_id")', 'length': 0, 'name': 'osm_id', 'precision': 0, 'type': 2}, {'expression': ' if( "name" is NULL, \'Unknown\', "name")', 'length': 0, 'name': 'name', 'precision': 0, 'type': 10}, {'expression': "concat(@inputkeytype,'-', @inputvaluetype )", 'length': 0, 'name': 'type', 'precision': 0, 'type': 10}],
            'INPUT': outputs['ExplodeHstoreField']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['RefactorFields'] = processing.run('qgis:refactorfields', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(13)
        if feedback.isCanceled():
            return {}

        # Refactor fields
        alg_params = {
            'FIELDS_MAPPING': [{'expression': '"osm_id"', 'length': 0, 'name': 'osm_id', 'precision': 0, 'type': 2}, {'expression': '"name"', 'length': 0, 'name': 'name', 'precision': 0, 'type': 10}, {'expression': '"type"', 'length': 0, 'name': 'type', 'precision': 0, 'type': 10}, {'expression': '"light_polmean"', 'length': 0, 'name': 'light_pol', 'precision': 0, 'type': 6}],
            'INPUT': outputs['Centroids']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['RefactorFields'] = processing.run('qgis:refactorfields', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(14)
        if feedback.isCanceled():
            return {}

        # Sample raster values
        alg_params = {
            'COLUMN_PREFIX': 'rvalue',
            'INPUT': outputs['RefactorFields']['OUTPUT'],
            'RASTERCOPY': outputs['BuildVirtualRaster']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['SampleRasterValues'] = processing.run('qgis:rastersampling', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(15)
        if feedback.isCanceled():
            return {}

        # Refactor fields
        alg_params = {
            'FIELDS_MAPPING': [{'expression': '"osm_id"', 'length': 0, 'name': 'osm_id', 'precision': 0, 'type': 2}, {'expression': '"name"', 'length': 0, 'name': 'name', 'precision': 0, 'type': 10}, {'expression': '"type"', 'length': 0, 'name': 'type', 'precision': 0, 'type': 10}, {'expression': '"rvalue_1"', 'length': 0, 'name': 'light_pol', 'precision': 0, 'type': 6}],
            'INPUT': outputs['SampleRasterValues']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['RefactorFields'] = processing.run('qgis:refactorfields', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(16)
        if feedback.isCanceled():
            return {}

        # Merge vector layers
        alg_params = {
            'CRS': None,
            'LAYERS': [outputs['RefactorFields']['OUTPUT'],outputs['RefactorFields']['OUTPUT']],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['MergeVectorLayers'] = processing.run('native:mergevectorlayers', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(17)
        if feedback.isCanceled():
            return {}

        # Refactor fields
        alg_params = {
            'FIELDS_MAPPING': [{'expression': '"osm_id"', 'length': 16, 'name': 'osm_id', 'precision': 0, 'type': 4}, {'expression': '"name"', 'length': 33, 'name': 'name', 'precision': 0, 'type': 10}, {'expression': '"type"', 'length': 6, 'name': 'type', 'precision': 0, 'type': 10}, {'expression': '"light_pol"', 'length': 18, 'name': 'light_pol', 'precision': 10, 'type': 6}, {'expression': ' $y ', 'length': 18, 'name': 'lat', 'precision': 6, 'type': 6}, {'expression': '$x', 'length': 18, 'name': 'lng', 'precision': 6, 'type': 6}],
            'INPUT': outputs['MergeVectorLayers']['OUTPUT'],
            'OUTPUT': parameters['Outputfinal2']
        }
        outputs['RefactorFields'] = processing.run('qgis:refactorfields', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        results['Outputfinal2'] = outputs['RefactorFields']['OUTPUT']
        return results

    def name(self):
        return 'OSM'

    def displayName(self):
        return 'OSM'

    def group(self):
        return ''

    def groupId(self):
        return ''

    def createInstance(self):
        return Osm()
