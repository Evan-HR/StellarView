import sys

from qgis.core import (
     QgsApplication, 
     QgsProcessingFeedback, 
     QgsVectorLayer
)

# See https://gis.stackexchange.com/a/155852/4972 for details about the prefix 
QgsApplication.setPrefixPath('/usr', True)
qgs = QgsApplication([], False)
qgs.initQgis()

# Append the path where processing plugin can be found
sys.path.append('/docs/dev/qgis/build/output/python/plugins')

import processing
from processing.core.Processing import Processing
Processing.initialize()

layer1 = QgsVectorLayer('/path/to/geodata/lines_1.shp', 'layer 1', 'ogr')
layer2 = QgsVectorLayer('/path/to/geodata/lines_2.shp', 'layer 2', 'ogr')

# You can see what parameters are needed by the algorithm  
# using: processing.algorithmHelp("qgis:union")
params = { 
    'INPUT' : layer1,
    'OVERLAY' : layer2, 
    'OUTPUT' : '/path/to/output_layer.gpkg|layername=output'
}
feedback = QgsProcessingFeedback()

res = processing.run('qgis:union', params, feedback=feedback)
res['OUTPUT'] # Access your output layer