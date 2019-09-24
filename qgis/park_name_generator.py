### REMINDER: CHECK INPUTS BEFORE RUNNING ON FULL NA DATASET ###
import sys, getopt
import json
import csv
import requests
import time
import colorama
import os

try:
    opts, args = getopt.getopt(sys.argv[1:], "hi:o:", ["ifile=", "ofile="])
except getopt.GetoptError:
    print("park_name_generator.py -i <inputfile> -o <outputfile>")
    sys.exit(2)
for opt, arg in opts:
    if opt == "-h":
        print("park_name_generator.py -i <inputfile> -o <outputfile>")
        sys.exit()
    elif opt in ("-i", "--ifile"):
        print(arg)
        sourceFile = open(arg, "r")
    elif opt in ("-o", "--ofile"):
        outputFile = open(arg, "a+", newline="\n", encoding="utf-8")

maxLightPol = float(input("Maximum acceptable light pollution? (Recommended 7)"))

timeLimit = 1  # How often to send requests in seconds

colorama.init()

# sourceFile = open("../data/ontario_parks.csv", newline="")
# outputFile = open("../data/ontario_parks_out.csv", "a", newline="", encoding="utf-8")

startTime = time.time()
startLine = 0
for line in outputFile:
    startLine += 1
outputFile.seek(0, os.SEEK_END)
# startLine = int(input("Start line?"))

# Input row order: osmid, name, type, light_pol, lat, lng
# Output row order: id, name, light_pol, lat, lng

total_line_count = sum(1 for line in sourceFile)
sourceFile.seek(0)

csv_reader = csv.reader(sourceFile, delimiter=",")
csv_writer = csv.writer(outputFile)
outputFile.seek(0, os.SEEK_END)
line_count = 0
processed = 0
pruned = 0
total = 0

# csv_writer.writerow(
#     ["id", "osmid", "name", "alt_name", "light_pol", "lat", "lng"])
first = True
for row in csv_reader:
    line_count += 1
    if first:
        first = False
        continue
    # Go to previous line
    print(
        f"Processing {line_count}/{total_line_count} ({(line_count/total_line_count * 100):.2f}%):"
    )
    print(f"{row}")

    if line_count < startLine:
        print(
            colorama.Fore.RED
            + f"Already processed! Skipping!"
            + colorama.Style.RESET_ALL
        )
        continue

    try:
        parkLightPol = float(row[3])
    except:
        parkLightPol = 0
    if parkLightPol > maxLightPol:
        print(
            colorama.Fore.YELLOW
            + f"Light pollution too high: {row[3]}, filtering..."
            + colorama.Style.RESET_ALL
        )
        pruned += 1
        continue
    else:
        print(
            colorama.Fore.GREEN
            + f"Light pollution pass: {row[3]}"
            + colorama.Style.RESET_ALL
        )

    alt_name = row[1]
    if row[1] == "Unknown" or "?" in row[1] or len(row[1]) <= 3:
        print(
            "Invalid name: " + colorama.Fore.RED + alt_name + colorama.Style.RESET_ALL
        )
        elapsedTime = time.time() - startTime
        print(
            f"API timer: "
            + (colorama.Fore.GREEN if (elapsedTime < timeLimit) else colorama.Fore.RED)
            + f"{elapsedTime - timeLimit:.2f}s"
            + colorama.Style.RESET_ALL
        )
        if elapsedTime < timeLimit:
            time.sleep(timeLimit - elapsedTime)
        startTime = time.time()
        processed += 1

        for attempt in range(10):
            try:
                response = requests.get(
                    f"https://nominatim.openstreetmap.org/reverse?format=json&lat={row[4]}&lon={row[5]}"
                )
            except:
                print(
                    colorama.Back.YELLOW
                    + f"Request attempt {attempt} failed, retrying..."
                    + colorama.Style.RESET_ALL
                )
                time.sleep(attempt)
            else:
                break
        else:
            print(colorama.Back.RED + "Failed to reach nominatim server!")
            sys.exit()

        data = response.json()
        if "name" in data.keys():
            alt_name = data["name"]
        else:
            if (
                "house_number" in data["address"].keys()
                and data["address"]["house_number"]
                == data["display_name"].split(", ")[0]
            ):
                alt_name = f"{data['display_name'].split(', ')[0]} {data['display_name'].split(', ')[1]}"
            else:
                alt_name = f"{data['display_name'].split(', ')[0]}"
        print("New name: " + colorama.Fore.YELLOW + alt_name + colorama.Style.RESET_ALL)
    total += 1
    csv_writer.writerow([row[0], alt_name, row[3], row[4], row[5]])
print('\a')
print(
    f"Processed {line_count} parks, wrote {total} park: \n {processed} unknowns, {pruned} filtered"
)
