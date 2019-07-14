import json
import requests
from scipy.interpolate import griddata
import numpy as np
import matplotlib.pyplot as plt
import colorama

# from tabulate import tabulate
from prettytable import PrettyTable
from sklearn.metrics import (
    mean_absolute_error,
    median_absolute_error,
    r2_score,
    explained_variance_score,
)

coord = (48.406414, -89.259796)
lat = coord[0]
lng = coord[1]
url = f"http://api.openweathermap.org/data/2.5/find?lat={lat}&lon={lng}&cnt=50&APPID=08c7fcf7e68ec973d48dda2ba76e8314"
print(url)
response = requests.get(url)
# response = requests.get(f'http://api.openweathermap.org/data/2.5/box/city?bbox=-82.43659184,42.2636709,-80.2994317,44.4901755,35&APPID=08c7fcf7e68ec973d48dda2ba76e8314')
weather = response.json()
stations = [station for station in weather["list"]]
maxLat = max([station["coord"]["lat"] for station in stations])
minLat = min([station["coord"]["lat"] for station in stations])
maxLng = max([station["coord"]["lon"] for station in stations])
minLng = min([station["coord"]["lon"] for station in stations])

h = maxLat - minLat
w = maxLng - minLng
print(f"Heigh: {h}, Width: {w}")
size = max(h, w)
f = 0.5

maxLat += f * size
minLat -= f * size
maxLng += f * size
minLng -= f * size

simulatedParks = np.random.uniform(
    low=[minLng, minLat], high=[maxLng, maxLat], size=(20, 2)
)

simParksResults = []
for i in range(0, len(simulatedParks)):
    response = requests.get(
        f"http://api.openweathermap.org/data/2.5/weather?lat={simulatedParks[i][1]}&lon={simulatedParks[i][0]}&APPID=08c7fcf7e68ec973d48dda2ba76e8314"
    )
    weather = response.json()
    simParksResults += [weather["clouds"]["all"]]
simParksResults = np.array(simParksResults)

# points = np.random.rand(1000,2)
# print(points)
names = [station["name"] for station in stations]
points = np.array(
    [[station["coord"]["lon"], station["coord"]["lat"]] for station in stations]
)
# values = np.array([station["main"]["humidity"] for station in stations])
values = np.array([station["clouds"]["all"] for station in stations])
grid_x, grid_y = np.mgrid[minLng:maxLng:500j, minLat:maxLat:500j]

# Populate edge
edge_x, edge_y = np.mgrid[minLng:maxLng:10j, minLat:maxLat:10j]
gridEdge = griddata(points, values, (edge_x, edge_y), method="nearest")
# print((edge_x, edge_y))
edge1 = np.array([[edge_x[0, i], edge_y[0, i]] for i in range(0, len(edge_x))])
values1 = np.array([gridEdge[0, i] for i in range(0, len(edge_x))])

edge2 = np.array([[edge_x[-1, i], edge_y[-1, i]] for i in range(0, len(edge_x))])
values2 = np.array([gridEdge[-1, i] for i in range(0, len(edge_x))])

edge3 = np.array([[edge_x[i, 0], edge_y[i, 0]] for i in range(0, len(edge_x))])
values3 = np.array([gridEdge[i, 0] for i in range(0, len(edge_x))])

edge4 = np.array([[edge_x[i, -1], edge_y[i, -1]] for i in range(0, len(edge_x))])
values4 = np.array([gridEdge[i, -1] for i in range(0, len(edge_x))])

points_alt = np.concatenate((points, edge1, edge2, edge3, edge4))
values_alt = np.concatenate((values, values1, values2, values3, values4))

# print(gridEdge)

grid_z0 = griddata(points, values, (grid_x, grid_y), method="nearest")
grid_z1 = griddata(points, values, (grid_x, grid_y), method="linear")
grid_z2 = griddata(points, values, (grid_x, grid_y), method="cubic")
grid_z1e = griddata(points_alt, values_alt, (grid_x, grid_y), method="linear")
grid_z2e = griddata(points_alt, values_alt, (grid_x, grid_y), method="cubic")

plt.suptitle("Clouds Estimation")

plt.subplot(231)
plt.plot(points[:, 0], points[:, 1], marker=".", color="k", linestyle="none")
plt.imshow(grid_z0.T, origin="lower", extent=(minLng, maxLng, minLat, maxLat))
for i in range(0, len(points)):
    plt.text(points[i][0], points[i][1], f"{values[i]}")
for i in range(0, len(simParksResults)):
    plt.text(simulatedParks[i][0], simulatedParks[i][1], f"{simParksResults[i]}")
plt.plot(
    simulatedParks[:, 0], simulatedParks[:, 1], marker="x", color="g", linestyle="none"
)
plt.ylabel("lat")
plt.xlabel("lng")
plt.title("Weather Stations")

plt.subplot(234)
plt.imshow(grid_z0.T, origin="lower", extent=(minLng, maxLng, minLat, maxLat))
plt.plot(
    simulatedParks[:, 0], simulatedParks[:, 1], marker="x", color="r", linestyle="none"
)
parkDataNN = griddata(points, values, simulatedParks, method="nearest")
for i in range(0, len(simulatedParks)):
    plt.text(simulatedParks[i][0], simulatedParks[i][1], f"{round(parkDataNN[i],1)}")
plt.ylabel("lat")
plt.xlabel("lng")
plt.title("Nearest Neighbor")
print()

plt.subplot(232)
plt.plot(
    simulatedParks[:, 0], simulatedParks[:, 1], marker="x", color="r", linestyle="none"
)
plt.imshow(grid_z1.T, origin="lower", extent=(minLng, maxLng, minLat, maxLat))
parkDataLI = griddata(points, values, simulatedParks, method="linear")
for i in range(0, len(simulatedParks)):
    plt.text(simulatedParks[i][0], simulatedParks[i][1], f"{round(parkDataLI[i],1)}")
plt.ylabel("lat")
plt.xlabel("lng")
plt.title("Linear Interpolation")

plt.subplot(233)
# plt.plot(points[:, 0], points[:, 1], marker='.', color='k', linestyle="none")
plt.imshow(grid_z2.T, origin="lower", extent=(minLng, maxLng, minLat, maxLat))
plt.plot(
    simulatedParks[:, 0], simulatedParks[:, 1], marker="x", color="r", linestyle="none"
)
parkDataCI = griddata(points, values, simulatedParks, method="cubic")
for i in range(0, len(simulatedParks)):
    plt.text(simulatedParks[i][0], simulatedParks[i][1], f"{round(parkDataCI[i],1)}")
plt.ylabel("lat")
plt.xlabel("lng")
plt.title("Cubic Interpolation")

plt.subplot(235)
# plt.plot(points[:, 0], points[:, 1], marker='.', color='k', linestyle="none")
plt.imshow(grid_z1e.T, origin="lower", extent=(minLng, maxLng, minLat, maxLat))
plt.plot(
    simulatedParks[:, 0], simulatedParks[:, 1], marker="x", color="r", linestyle="none"
)
parkDataLIe = griddata(points_alt, values_alt, simulatedParks, method="linear")
for i in range(0, len(simulatedParks)):
    plt.text(simulatedParks[i][0], simulatedParks[i][1], f"{round(parkDataLIe[i],1)}")
plt.ylabel("lat")
plt.xlabel("lng")
plt.title("Linear Interpolation - Extended")

plt.subplot(236)
# plt.plot(points[:, 0], points[:, 1], marker='.', color='k', linestyle="none")
plt.imshow(grid_z2e.T, origin="lower", extent=(minLng, maxLng, minLat, maxLat))
plt.plot(
    simulatedParks[:, 0], simulatedParks[:, 1], marker="x", color="r", linestyle="none"
)
parkDataCIe = griddata(points_alt, values_alt, simulatedParks, method="cubic")
for i in range(0, len(simulatedParks)):
    plt.text(simulatedParks[i][0], simulatedParks[i][1], f"{round(parkDataCIe[i],1)}")
plt.ylabel("lat")
plt.xlabel("lng")
plt.title("Cubic Interpolation - exteded")

# for i in range(0, len(points)):
#     plt.text(points[i][0], points[i][1], f'{values[i]}')

# cax = plt.axes([0.85, 0.1, 0.075, 0.8])
# plt.colorbar(cax=cax)

# print(tabulate([[simParksResults, parkDataNN, parkDataLIe, parkDataCIe], headers=['Actual', 'NN', 'LI-e', 'CI-e']]))
t = PrettyTable(["Station", "Actual", "NN", "LI-e", "CI-e"])
for i in range(0, len(simParksResults)):
    t.add_row(
        [
            names[i],
            simParksResults[i],
            parkDataNN[i],
            round(parkDataLIe[i], 1),
            round(parkDataCIe[i], 1),
        ]
    )
print(t)
print("Stats:")
t = PrettyTable(["", "Actual", "NN", "LI-e", "CI-e"])
t.add_row(
    [
        "Mean Abs Err",
        mean_absolute_error(simParksResults, simParksResults),
        mean_absolute_error(simParksResults, parkDataNN),
        round(mean_absolute_error(simParksResults, parkDataLIe), 3),
        round(mean_absolute_error(simParksResults, parkDataCIe), 3),
    ]
)
t.add_row(
    [
        "Med Abs Err",
        round(median_absolute_error(simParksResults, simParksResults), 1),
        round(median_absolute_error(simParksResults, parkDataNN), 3),
        round(median_absolute_error(simParksResults, parkDataLIe), 3),
        round(median_absolute_error(simParksResults, parkDataCIe), 3),
    ]
)
t.add_row(
    [
        "var score",
        explained_variance_score(simParksResults, simParksResults),
        explained_variance_score(simParksResults, parkDataNN),
        explained_variance_score(simParksResults, parkDataLIe),
        explained_variance_score(simParksResults, parkDataCIe),
    ]
)
t.add_row(
    [
        "r2 score",
        r2_score(simParksResults, simParksResults),
        r2_score(simParksResults, parkDataNN),
        r2_score(simParksResults, parkDataLIe),
        r2_score(simParksResults, parkDataCIe),
    ]
)
print(t)

plt.show()
# input()

# print([station["coord"]["lat"] for station in stations])
