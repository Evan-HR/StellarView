#Run this code via the built-in qgis python shell
from qgis.core import *
import processing

inputTypes = [("leisure", "park"), ("leisure", "nature_reserve")]
provinces = ["Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", 
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"]

for type in inputTypes:
    for province in provinces:
        print(f"Processing...\n {type[0]}-{type[1]}->{province}\n")
        processing.run("model:OSM", 
            {
                'inputarea':f'{province}',
                'inputkeytype':f'{type[0]}',
                'inputvaluetype':f'{type[1]}',
                'lightmap':'D:/StarGzr/SVDNB_npp_20190401-20190430_75N180W_vcmcfg_v10_c201905191000.avg_rade9h.tif', ###Your pollution source HERE###
                'qgis:refactorfields_5:Output final':f'D:/StarGzr/SampleOut/{type[0]}-{type[1]}-{province}.csv' ###Your destination HERE###
            })

print("Success!")