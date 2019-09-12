### REMINDER: CHECK INPUTS BEFORE RUNNING ON FULL NA DATASET ###
import sys, getopt
import json
import csv
import requests
import time
import colorama

try:
    opts, args = getopt.getopt(argv, "hi:o:", ["ifile=", "ofile="])
except getopt.GetoptError:
    print("park_name_generator.py -i <inputfile> -o <outputfile>")
    sys.exit(2)
for opt, arg in opts:
    if opt == "-h":
        print("park_name_generator.py -i <inputfile> -o <outputfile>")
        sys.exit()
    elif opt in ("-i", "--ifile"):
        sourceFile = arg
    elif opt in ("-o", "--ofile"):
        outputFile = arg

timeLimit = 1  # How often to send requests in seconds

colorama.init()

# sourceFile = open("../data/ontario_parks.csv", newline="")
# outputFile = open("../data/ontario_parks_out.csv", "a", newline="", encoding="utf-8")

startTime = time.time()
startLine = 0
for line in outputFile:
    startLine += 1
# startLine = int(input("Start line?"))

# Input row order: id, osmid, name, light_pol, lat, lng
# Output row order: id, osmid, name, alt_name, light_pol, lat, lng
with sourceFile:
    csv_reader = csv.reader(sourceFile, delimiter=",")
    csv_writer = csv.writer(outputFile)
    line_count = 0
    # csv_writer.writerow(
    #     ["id", "osmid", "name", "alt_name", "light_pol", "lat", "lng"])
    for row in csv_reader:
        if int(row[0]) < startLine:
            continue

        print(f"Id: {row[0]}, Name: {row[2]}")
        alt_name = row[2]

        if row[2] == "Unknown" or "?" in row[2] or len(row[2]) <= 3:
            elapsedTime = time.time() - startTime
            print(f"API timer: {timeLimit - elapsedTime}s")
            if elapsedTime < timeLimit:
                time.sleep(timeLimit - elapsedTime)
            startTime = time.time()
            line_count += 1

            for attempt in range(10):
                try:
                    response = requests.get(
                        f"https://nominatim.openstreetmap.org/reverse?format=json&lat={row[5]}&lon={row[4]}"
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
            print(colorama.Fore.RED + alt_name + colorama.Style.RESET_ALL)
        csv_writer.writerow([row[0], row[1], row[2], alt_name, row[3], row[5], row[4]])
    print(f"Processed {line_count} unknowns.")
