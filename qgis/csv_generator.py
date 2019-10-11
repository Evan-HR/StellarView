# Run this code via the built-in qgis python shell
###TODO: fix the paths
from qgis.core import *
import processing

import os.path
from os import path

inputTypes = [("leisure", "park"), ("leisure", "nature_reserve")]
Canada = [
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
America = [
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
Oceania = [
    "New South Wales",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
    "Australian Capital Territory",
    "Northern Territory",
    "New Zealand",
]

f = open("logs.txt", "w+")

try:
for type in inputTypes:
    print("CANADA")
    for province in Canada:
        if (os.path.isfile(f"./GitHub/StellarGaze/qgis/data/Output/Canada-{province}-{type[0]}-{type[1]}.csv")):
            print(f"Skipping {province}, already exists at: Canada-{province}-{type[0]}-{type[1]}.csv")
            continue
        print(f"Processing...\n {type[0]}-{type[1]}->{province}\n")
        try:
            processing.run(
                "model:OSM",
                {
                    "inputarea": f"{province}",
                    "inputkeytype": f"{type[0]}",
                    "inputvaluetype": f"{type[1]}",
                    "lightmap": "./GitHub/StellarGaze/qgis/data/lightPollution-1.tif",  ###Your pollution source HERE###
                    "lightmap2": "./GitHub/StellarGaze/qgis/data/lightPollution-2.tif",  ###Your pollution source HERE###
                    "qgis:refactorfields_6:OutputFinal2": f"./GitHub/StellarGaze/qgis/data/Output/Canada-{province}-{type[0]}-{type[1]}.csv",  ###Your destination HERE###
                },
            )
        except Exception as e:
            print(f"Failed to process {province}:")
            print(e)
            f.write(f"Canada-{province}-{type[0]}-{type[1]}")

    print("AMERICA")
    for province in America:
        if (os.path.isfile(f"./GitHub/StellarGaze/qgis/data/Output/America-{province}-{type[0]}-{type[1]}.csv")):
            print(f"Skipping {province}, already exists at: America-{province}-{type[0]}-{type[1]}.csv")
            continue
        print(f"Processing...\n {type[0]}-{type[1]}->{province}\n")
        try:
            processing.run(
                "model:OSM",
                {
                    "inputarea": f"{province}",
                    "inputkeytype": f"{type[0]}",
                    "inputvaluetype": f"{type[1]}",
                    "lightmap": "./GitHub/StellarGaze/qgis/data/lightPollution-1.tif",  ###Your pollution source HERE###
                    "lightmap2": "./GitHub/StellarGaze/qgis/data/lightPollution-2.tif",  ###Your pollution source HERE###
                    "qgis:refactorfields_6:OutputFinal2": f"./GitHub/StellarGaze/qgis/data/Output/America-{province}-{type[0]}-{type[1]}.csv",  ###Your destination HERE###
                },
            )
        except Exception as e:
            print(f"Failed to process {province}:")
            print(e)
            f.write(f"America-{province}-{type[0]}-{type[1]}")

    print("OCEANIA")
    for province in Oceania:
        if (os.path.isfile(f"./GitHub/StellarGaze/qgis/data/Output/Oceania-{province}-{type[0]}-{type[1]}.csv")):
            print(f"Skipping {province}, already exists at: Oceania-{province}-{type[0]}-{type[1]}.csv")
            continue
        print(f"Processing...\n {type[0]}-{type[1]}->{province}\n")
        try:
            processing.run(
                "model:OSM",
                {
                    "inputarea": f"{province}",
                    "inputkeytype": f"{type[0]}",
                    "inputvaluetype": f"{type[1]}",
                    "lightmap": "./GitHub/StellarGaze/qgis/data/lightPollution-3.tif",  ###Your pollution source HERE###
                    "qgis:refactorfields_6:OutputFinal2": f"./GitHub/StellarGaze/qgis/data/Output/Oceania-{province}-{type[0]}-{type[1]}.csv",  ###Your destination HERE###
                },
            )
        except Exception as e:
            print(f"Failed to process {province}:")
            print(e)
            f.write(f"Oceania-{province}-{type[0]}-{type[1]}")
print('\a')
print("Success!")
f.close()
