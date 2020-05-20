const axios = require("axios");
const suncalc = require("suncalc");
const clustering = require("density-clustering");
const geolib = require("geolib");

async function getClusterParkWeatherData(parkDataJSON, userTime, weatherKey1) {
	var parkCoordinates = [];
	for (var i = 0; i < parkDataJSON.length; i++) {
		parkCoordinates[i] = [parkDataJSON[i].lat, parkDataJSON[i].lng];
	}
	//Define custom distance function to use,
	//since coordinate distances are not cartesian distances
	function kmeansDistance(p, q) {
		return geolib.getDistance(
			{ lat: p[0], lng: p[1] },
			{ lat: q[0], lat: q[1] }
		);
	}
	//Clustering code
	var kmeans = new clustering.KMEANS();
	// parameters: 3 - number of clusters
	var clusterCount = Math.round(parkDataJSON.length / 5); //TODO: Find a better cluster number
	if (clusterCount > 10) clusterCount = 10;
	var clusters = kmeans.run(parkCoordinates, clusterCount, kmeansDistance);
	//Find coordinates at the center of each cluster
	let clusterCentroids = [];
	for (var clusterNum = 0; clusterNum < clusters.length; clusterNum++) {
		//Add park coordinates to the cluster the park is in
		let clusterCoordinates = [];
		for (var i = 0; i < clusters[clusterNum].length; i++) {
			clusterCoordinates.push({
				lat: parkDataJSON[clusters[clusterNum][i]].lat,
				lng: parkDataJSON[clusters[clusterNum][i]].lng,
			});
		}
		//console.log(clusterCoordinates);
		let clusterCentroid = geolib.getCenter(clusterCoordinates);
		//console.log(clusterCentroid);
		//Calculate each park's distance to cluster center
		let clusterDist = [];
		for (var i = 0; i < clusters[clusterNum].length; i++) {
			parkDataJSON[clusters[clusterNum][i]].cluster = clusterNum;
			clusterDist.push(
				geolib.getDistance(
					{
						lat: parkDataJSON[clusters[clusterNum][i]].lat,
						lng: parkDataJSON[clusters[clusterNum][i]].lng,
					},
					clusterCentroid
				)
			);
		}
		console.log(
			"Cluster",
			clusterNum,
			"...Max dist:",
			Math.max.apply(null, clusterDist),
			"...Avg dist:",
			clusterDist.reduce((a, b) => a + b) / clusterDist.length
		);
		//TODO: CHECK IF CLUSTERDIST IS OKAY
		clusterCentroids.push(clusterCentroid);
	}
	console.log(clusterCentroids);
	//Grab weather for each cluster
	let weatherInstance = null;
	let response = null;
	for (var clusterNum = 0; clusterNum < clusters.length; clusterNum++) {
		var times = suncalc.getTimes(
			new Date(userTime),
			clusterCentroids[clusterNum].latitude,
			clusterCentroids[clusterNum].longitude
		);
		var nightTime = new Date(times.night);
		var dawnTime = new Date(times.dawn);
		//If current time is past night-time, or before dawn, use current weather
		if (userTime > nightTime || userTime < dawnTime) {
			weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${clusterCentroids[clusterNum].latitude}&lon=${clusterCentroids[clusterNum].longitude}&appid=${weatherKey1}&units=metric`;
			response = await axios
				.get(weatherURL)
				.then((response) => response.data)
				.catch(false);
			weatherInstance = response;
			for (var i = 0; i < clusters[clusterNum].length; i++) {
				parkDataJSON[clusters[clusterNum][i]].weather = {
					time: userTime.getTime(),
					city: response.name,
					clouds: weatherInstance.clouds.all,
					cloudDesc: weatherInstance.weather[0].description,
					humidity: weatherInstance.main.humidity,
					temp: weatherInstance.main.temp,
					stationCoord: {
						lat: response.coord.lat,
						lng: response.coord.lon,
					},
					stationDist:
						geolib.getDistance(
							{
								lat: parkDataJSON[clusters[clusterNum][i]].lat,
								lng: parkDataJSON[clusters[clusterNum][i]].lng,
							},
							{
								lat: response.coord.lat,
								lng: response.coord.lon,
							}
						) / 1000,
				};
			}
			//Otherwise use forecast weather
		} else {
			weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${clusterCentroids[clusterNum].latitude}&lon=${clusterCentroids[clusterNum].longitude}&cnt=50&appid=${weatherKey1}&units=metric`;
			console.log(weatherURL);
			response = await axios
				.get(weatherURL)
				.then((response) => response.data)
				.catch(false);
			//Go through the forecasts and find the closest one to nightfall
			for (var i = 0; i < response.cnt; i++) {
				console.log(
					new Date(response.list[i].dt_txt).getTime(),
					nightTime.getTime(),
					new Date(response.list[i].dt_txt).getTime() >
						nightTime.getTime()
				);
				if (
					new Date(response.list[i].dt_txt).getTime() >
					nightTime.getTime()
				) {
					//If the date before nightfall is closer to nightfall than the one after, pick the closer one
					let succInst = i;
					if (
						i > 0 &&
						Math.abs(
							new Date(response.list[i - 1].dt_txt) -
								nightTime.getTime()
						) <
							Math.abs(
								new Date(response.list[i].dt_txt).getTime() -
									nightTime.getTime()
							)
					) {
						succInst = i - 1;
					}
					console.log(
						"Success! Looking at ",
						succInst,
						":",
						response.list[succInst]
					);
					weatherInstance = response.list[succInst];
					break;
				}
			}
			//Create weather object
			for (var i = 0; i < clusters[clusterNum].length; i++) {
				parkDataJSON[clusters[clusterNum][i]].weather = {
					time: new Date(weatherInstance.dt_txt).getTime(),
					city: response.city.name,
					clouds: weatherInstance.clouds.all,
					cloudDesc: weatherInstance.weather[0].description,
					humidity: weatherInstance.main.humidity,
					temp: weatherInstance.main.temp,
					stationCoord: {
						lat: response.city.coord.lat,
						lng: response.city.coord.lon,
					},
					stationDist:
						geolib.getDistance(
							{
								lat: parkDataJSON[clusters[clusterNum][i]].lat,
								lng: parkDataJSON[clusters[clusterNum][i]].lng,
							},
							{
								lat: response.city.coord.lat,
								lng: response.city.coord.lon,
							}
						) / 1000,
				};
			}
		}
	}
	return parkDataJSON;
}

exports.getClusterParkWeatherData = getClusterParkWeatherData;
