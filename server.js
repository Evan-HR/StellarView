const express = require("express");
const mysql = require("mysql");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");
const cors = require("cors");
const { getMoon, getMoonPhaseString } = require("./serverSrc/helperFunctions");
const {
  getClusterParkWeatherData,
} = require("./serverSrc/getClusterParkWeatherData");

const suncalc = require("suncalc");

var session = require("express-session");

var MySQLStore = require("express-mysql-session")(session);

var cookieParser = require("cookie-parser");

var sslRedirect = require("heroku-ssl-redirect");

require("dotenv").config();
const mapsKey1 = process.env.REACT_APP_DUSTINMAPKEY;
const weatherKey1 = process.env.REACT_APP_EVANWEATHERKEY;
exports.weatherKey1 = weatherKey1;
const cookieKey = process.env.SECRET;

const app = express();
const port = process.env.PORT || 5000;

app.use(sslRedirect());
app.use(cors());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "client", "build")));

app.get(/^\/(?!api).*/, (req, res) => {
  let redirectPath = path.join(__dirname, "client", "build", "index.html");
  console.log("Redirecting to...", redirectPath);
  res.sendFile(redirectPath);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

var connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

connection.connect();

var options = {
  host: process.env.JAWSDB_MARIA_HOST,
  user: process.env.JAWSDB_MARIA_USER,
  password: process.env.JAWSDB_MARIA_PASSWORD,
  database: process.env.JAWSDB_MARIA_DATABASE,
};

var sessionStore = new MySQLStore(options);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(morgan("short"));

app.use(cookieParser());
app.use(express.static("./public"));
app.use(
  session({
    secret: cookieKey,
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: { httpOnly: false },
  })
);

app.get("/park/:id", function (req, res) {
  var id = req.params.id;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const queryString =
    "SELECT name, light_pol, lat, lng from ontario_parks WHERE id=?";
  connection.query(queryString, id, (err, parkInfo) => {
    if (err) {
      console.log("failed" + err);
      res.sendStatus(500);
      return;
    }
    res.render("park.ejs", {
      parkname: parkInfo[0].name,
      parkid: parkInfo[0].id,
      parklightpol: parkInfo[0].light_pol,
      parklocation: [parkInfo[0].lat, parkInfo[0].lng],
      userlocation: [lat, lng],
      mapAPIKey: mapsKey1,
    });
    res.end();
  });
});

app.post("/api/getParkData", async (req, res) => {
  const lat = req.body.lat;
  const lng = req.body.lng;
  const dist = req.body.dist;
  const lightpol = req.body.lightpol;
  const userTime = new Date(req.body.utime);
  const numResults = req.body.numResults ? req.body.numResults : 100; //Fallback number of results to return

  //6371 is km, 3959 is miles
  const queryFromUserForm =
    "SELECT *, ( 6371 * acos( cos( radians( ? ) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( lat ) ) ) ) AS distance FROM ontario_parks HAVING distance <= ? AND light_pol <= ? ORDER BY distance ASC";

  try {
    var initialResults = await new Promise((resolve, reject) => {
      connection.query(
        queryFromUserForm,
        [lat, lng, lat, dist, lightpol],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  } catch (err) {
    console.log("failed" + err);
    res.sendStatus(500);
    return;
  }

  let totalResults = initialResults.length;
  if (initialResults.length > numResults) {
    initialResults = initialResults.slice(0, numResults);
  }
  let shownResults = initialResults.length;
  var parkDataJSON = JSON.parse(JSON.stringify(initialResults));

  parkDataJSON = await getClusterParkWeatherData(
    parkDataJSON,
    userTime,
    weatherKey1
  );

  var phaseInfo = getMoon(userTime);

  var moonType = getMoonPhaseString(phaseInfo.phase);

  let sunTimeData = suncalc.getTimes(
    userTime,
    parseFloat(lat),
    parseFloat(lng)
  );
  let moonTimeData = suncalc.getMoonTimes(
    userTime,
    parseFloat(lat),
    parseFloat(lng)
  );

  let reply = {
    totalResults: totalResults,
    shownResults: shownResults,
    parks: parkDataJSON,
    moonFraction: phaseInfo.fraction,
    moonPercent: phaseInfo.phase,
    moonType: moonType,
    stellarData: {
      sunrise: sunTimeData.sunrise,
      sunset: sunTimeData.sunset,
      night: sunTimeData.night,
      nightEnd: sunTimeData.nightEnd,
      moonrise: moonTimeData.rise,
      moonset: moonTimeData.set,
    },
  };

  res.send(reply);
});

app.post("/results.html", (req, res) => {
  const lat = req.body.lat;
  const lng = req.body.lng;
  const dist = req.body.dist;
  const lightpol = req.body.lightpol;

  //6371 is km, 3959 is miles
  const queryString =
    "SELECT *, ( 6371 * acos( cos( radians( ? ) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( lat ) ) ) ) AS distance FROM ontario_parks HAVING distance <= ? AND light_pol <= ? ORDER BY distance ASC";
  connection.query(
    queryString,
    [lat, lng, lat, dist, lightpol],
    (err, results) => {
      if (err) {
        console.log("failed" + err);
        res.sendStatus(500);
        return;
      }

      res.render("results.ejs", {
        location: [lat, lng],
        parks: results,
        mapAPIKey: mapsKey1,
      });
      res.end();
    }
  );
});
