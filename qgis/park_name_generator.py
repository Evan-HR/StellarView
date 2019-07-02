import json
import csv
import requests


# Input row order: id, osmid, name, light_pol, lat, lng
# Output row order: id, osmid, name, alt_name, light_pol, lat, lng
with open('../data/ontario_parks.csv', newline='') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    csv_writer = csv.writer(
        open('../data/ontario_parks_out.csv', 'w', newline=''))
    line_count = 0
    csv_writer.writerow(
        ["id", "osmid", "name", "alt_name", "light_pol", "lat", "lng"])
    for row in csv_reader:
        print(f'Id: {row[0]}, Name: {row[2]}')
        alt_name = row[2]
        if row[2] == "Unknown":
            line_count += 1
            response = requests.get(
                f'https://nominatim.openstreetmap.org/reverse?format=json&lat={row[5]}&lon={row[4]}')
            data = response.json()
            print(f'{data["address"][0]} {data["address"][1]}')
        csv_writer.writerow(
            [row[0], row[1], row[2], alt_name, row[3], row[4], row[5]])
    print(f'Processed {line_count} unknowns.')
