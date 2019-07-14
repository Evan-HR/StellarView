# Run this code via the built-in qgis python shell
from qgis.core import *
import processing

inputTypes = [("leisure", "park"), ("leisure", "nature_reserve")]
provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
]
states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
]

for type in inputTypes:
    for province in states:
        print(f"Processing...\n {type[0]}-{type[1]}->{province}\n")
        processing.run(
            "model:OSM",
            {
                "inputarea": f"{province}",
                "inputkeytype": f"{type[0]}",
                "inputvaluetype": f"{type[1]}",
                "lightmap": "D:/StarGzr/SVDNB_npp_20190401-20190430_75N180W_vcmcfg_v10_c201905191000.avg_rade9h.tif",  ###Your pollution source HERE###
                "qgis:refactorfields_5:Output final": f"D:/StarGzr/SampleOut/USA/{type[0]}-{type[1]}-{province}.csv",  ###Your destination HERE###
            },
        )

print("Success!")
