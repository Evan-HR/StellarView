import json
import csv
import requests
import time
import colorama

colorama.init()

startTime = time.time()
startLine = int(input("Start line?"))
# Input row order: id, osmid, name, light_pol, lat, lng
# Output row order: id, osmid, name, alt_name, light_pol, lat, lng
with open('../data/ontario_parks.csv', newline='') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    csv_writer = csv.writer(
        open('../data/ontario_parks_out.csv', 'a', newline='', encoding='utf-8'))
    line_count = 0
    # csv_writer.writerow(
    #     ["id", "osmid", "name", "alt_name", "light_pol", "lat", "lng"])
    for row in csv_reader:
        if(int(row[0]) < startLine):
            continue

        print(f'Id: {row[0]}, Name: {row[2]}')
        alt_name = row[2]
        if row[2] == "Unknown":
            elapsedTime = time.time() - startTime
            print(f'API timer: {elapsedTime}s')
            if(elapsedTime < 1.0):
                time.sleep(1.0 - elapsedTime)
            startTime = time.time()
            line_count += 1
            response = requests.get(
                f'https://nominatim.openstreetmap.org/reverse?format=json&lat={row[5]}&lon={row[4]}')
            data = response.json()
            if 'name' in data.keys():
                alt_name = data['name']
            else:
                if 'house_number' in data['address'].keys() and data['address']['house_number'] == data['display_name'].split(', ')[0]:
                    alt_name = f"{data['display_name'].split(', ')[0]} {data['display_name'].split(', ')[1]}"
                else:
                    alt_name = f"{data['display_name'].split(', ')[0]}"
            print(colorama.Fore.RED + alt_name + colorama.Style.RESET_ALL)
        csv_writer.writerow(
            [row[0], row[1], row[2], alt_name, row[3], row[5], row[4]])
    print(f'Processed {line_count} unknowns.')
