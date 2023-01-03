const axios = require("axios");
const suncalc = require("suncalc");
const geolib = require("geolib");

async function getIndividualParkWeatherAxios(park, userTime, weatherKey1) {
  var utime = new Date(userTime);
  var times = suncalc.getTimes(utime, park.lat, park.lng);
  var nightTime = new Date(times.night);
  var dawnTime = new Date(times.dawn);
  let weatherInstance = null;
  let response = null;
  let forecast = false;
  //If ucurrent time is past night-time or dawn use current weather
  if (utime > nightTime || utime < dawnTime) {
    weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${park.lat}&lon=${park.lng}&appid=${weatherKey1}&units=metric`;
  } else {
    forecast = true;
    weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${park.lat}&lon=${park.lng}&appid=${weatherKey1}&units=metric`;
  }
  response = await axios
    .get(weatherURL)
    .then((response) => response.data)
    .catch(false);
  if (!forecast) {
    //Get current weather
    weatherInstance = response;
    park.weather = {
      time: utime.getTime(),
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
            lat: park.lat,
            lng: park.lng,
          },
          {
            lat: response.coord.lat,
            lng: response.coord.lon,
          }
        ) / 1000,
    };
  } else {
    //Get forecast weather
    for (var i = 0; i < response.cnt; i++) {
      console.log(
        new Date(response.list[i].dt_txt).getTime(),
        nightTime.getTime(),
        new Date(response.list[i].dt_txt).getTime() > nightTime.getTime()
      );
      if (new Date(response.list[i].dt_txt).getTime() > nightTime.getTime()) {
        //If the date before nightfall is closer to nightfall than the one after, pick the closer one
        let succInst = i;
        if (
          i > 0 &&
          Math.abs(
            new Date(response.list[i - 1].dt_txt) - nightTime.getTime()
          ) <
            Math.abs(
              new Date(response.list[i].dt_txt).getTime() - nightTime.getTime()
            )
        ) {
          succInst = i - 1;
        }

        weatherInstance = response.list[succInst];
      }
      park.weather = {
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
              lat: park.lat,
              lng: park.lng,
            },
            {
              lat: response.city.coord.lat,
              lng: response.city.coord.lon,
            }
          ) / 1000,
      };
      break;
    }
  }
  return park;
}
exports.getIndividualParkWeatherAxios = getIndividualParkWeatherAxios;
