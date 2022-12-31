const {
  getMoon,
  toRadians,
  getMoonPhaseString,
} = require("./serverSrc/helperFunctions");
const {
  getClusterParkWeatherData,
} = require("./serverSrc/getClusterParkWeatherData");
const {
  getIndividualParkWeatherAxios,
} = require("./serverSrc/getIndividualParkWeatherAxios");

const express = require("express");
const mysql = require("mysql");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");

const suncalc = require("suncalc");

var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MySQLStore = require("express-mysql-session")(session);
var bcrypt = require("bcrypt");
const saltRounds = 10;
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

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (username, password, done) {
      const passQuery = "SELECT id,password from users WHERE email=?";
      connection.query(passQuery, [username], (err, results, fields) => {
        //passport handles this error
        if (err) {
          done(err);
        }
        if (results.length === 0) {
          done(null, false);
        } else {
          const hash = results[0].password.toString();

          bcrypt.compare(password, hash, function (err, response) {
            if (response === true) {
              return done(null, results[0].id);
            } else {
              return done(null, false);
            }
          });
        }
      });
    }
  )
);

app.get("/api/logout", function (req, res) {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.post(
  "/api/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/api/login",
  })
);

app.get("/api/getUserFavSpots", function (req, res) {
  const getFavSpotsQuery =
    "SELECT park_id from favorite_parks where user_id = ?";
  connection.query(
    getFavSpotsQuery,
    [req.session.passport.user],
    (err, favSpots) => {
      if (err) {
        console.log("failed" + err);
        res.sendStatus(500);
        return;
      } else {
        if (favSpots.length > 0) {
          tempSpots = [];
          for (var i = 0; i < favSpots.length; i++) {
            tempSpots.push(favSpots[i].park_id);
          }
          res.send(tempSpots);
        } else {
          res.sendStatus(204);
        }
      }
    }
  );
});

app.get("/api/getReviews", async function (req, res) {
  const getReviewQuery =
    "SELECT id, name, score, review, date from reviews where p_id = ?";

  try {
    var reviews = await new Promise((resolve, reject) => {
      connection.query(getReviewQuery, [req.query.parkID], (err, reviews) => {
        if (err) reject(err);
        resolve(reviews);
      });
    });
  } catch (err) {
    console.log("failed" + err);
    res.sendStatus(500);
    return;
  }
  if ((reviews.length = 0)) {
    res.sendStatus(204);
    return;
  }

  var reviewsJSON = JSON.parse(JSON.stringify(reviews));
  var score = 0;
  var reviewsLength = Object.keys(reviewsJSON).length;
  for (let review in reviewsJSON) {
    review = reviewsJSON[review];
    score = score + review.score;
  }

  var averageScore = Math.round((score / reviewsLength) * 10) / 10;
  let reply = {
    reviews: reviews,
    averageScore: averageScore,
    numReviews: reviewsLength,
  };

  res.send(reply);
});

app.post("/api/storeReview", function (req, res) {
  const insertReviewQuery =
    "INSERT INTO reviews (p_id, score, name, user_id, review) VALUES (?, ?, ?, ?, ?)";

  connection.query(
    insertReviewQuery,
    [
      req.body.parkID,
      req.body.score,
      req.body.name,
      req.body.user_id,
      req.body.review,
    ],
    (err, profileInfo) => {
      if (err) {
        console.log("failed" + err);
        res.sendStatus(500);
        return;
      }
      res.end();
    }
  );
});

app.post("/api/register", async function (req, res) {
  //client-side validation
  req.checkBody("name", "Preferred name cannot be empty.").notEmpty();
  req
    .checkBody("name", "Preferred name must be between 2-25 characters long.")
    .len(2, 25);
  req
    .checkBody("email", "The email you entered is invalid. Please try again.")
    .isEmail();
  req
    .checkBody("email", "Email address must be between 5-100 characters long.")
    .len(5, 100);
  req
    .checkBody("password2", "Passwords do not match. Please try again.")
    .equals(req.body.password1);
  const errors = req.validationErrors();

  if (errors) {
    res.status(422).json({ errors: errors });
    return;
  }
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password1;

  console.log("name email and password: " + name, email, "password");

  const emailQuery = "SELECT * from users WHERE email=?";

  try {
    var results = await new Promise((resolve, reject) => {
      connection.query(emailQuery, [email], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  } catch (err) {
    console.log("failed" + err);
    res.sendStatus(500);
    return;
  }

  if (results.length > 0) {
    var jsonString =
      '[{"msg" : "Email already registered.  Please try again."}]';
    var emailErrorJSON = JSON.parse(jsonString);
    console.log("errors is: ");
    console.log(emailErrorJSON.msg);
    res.status(422).json({ errors: emailErrorJSON });
    return;
  }

  const insertQuery =
    "INSERT into users (name, email, password) VALUES (?,?,?);";
  const getIDQuery = "SELECT LAST_INSERT_ID() as user_id;";

  //wrap insert query with bcrypt
  bcrypt.hash(password, saltRounds, function (err, hash) {
    connection.query(
      insertQuery,
      [name, email, hash],
      (err, results, fields) => {
        if (err) {
          console.log("failed to insert", err);
          res.sendStatus(500);
          return;
        } else {
          connection.query(getIDQuery, (err, results) => {
            if (err) {
              console.log("failed to getID", err);
              res.sendStatus(500);
              return;
            } else {
              const user_id = results[0].user_id;
              req.login(user_id, function (err) {
                res.redirect("/");
              });
            }
          });
        }
      }
    );
  });
});

passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});
passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});

app.get("/api/getUserAuth", (req, res) => {
  if (req.session.passport) {
    res.send(JSON.parse(true));
  } else {
    res.send(JSON.parse(false));
  }
});

app.get("/api/getUserInfo", (req, res) => {
  const nameQuery = "SELECT name from users WHERE id=?";
  if (req.session.passport) {
    console.log("Sending query");
    connection.query(
      nameQuery,
      [req.session.passport.user],
      (err, profileInfo) => {
        console.log("Got query response");
        if (err) {
          console.log("failed" + err);
          res.sendStatus(500);
          return;
        } else {
          console.log("profile info: ", profileInfo);

          tempName = profileInfo[0].name;
          const tempJSON = `{ "firstName": "${
            profileInfo[0].name
          }", "isAuth": ${req.isAuthenticated()}, "userID": ${
            req.session.passport.user
          } }`;
          res.send(tempJSON);
        }
      }
    );
  } else {
    console.log("No req.session.passport detected");
    res.sendStatus(500);
  }
});

app.get("/api/getUserReviews", (req, res) => {
  const getUserReviewQuery = "SELECT p_id from reviews WHERE user_id=?";
  //if logged in...
  if (req.session.passport) {
    connection.query(
      getUserReviewQuery,
      [req.session.passport.user],
      (err, reviewResults) => {
        if (err) {
          res.sendStatus(500);
          return;
        } else {
          if (reviewResults.length > 0) {
            tempReviews = [];
            for (var i = 0; i < reviewResults.length; i++) {
              tempReviews.push(reviewResults[i].p_id);
            }

            res.send(tempReviews);
          } else {
            res.sendStatus(204);
          }
        }
      }
    );
  }
});

app.post("/api/postFavSpot", (req, res) => {
  const insertFavParkQuery =
    "INSERT INTO favorite_parks (park_id, user_id) VALUES (?, ?)";
  connection.query(
    insertFavParkQuery,
    [req.body.params.park_id, req.body.params.user_id],
    (err, results) => {
      if (err) {
        console.log("failed" + err);
        res.sendStatus(500);
        return;
      }
      res.end();
    }
  );
});

app.post("/api/postUnfavSpot", (req, res) => {
  const deleteFavParkQuery =
    "DELETE FROM favorite_parks WHERE park_id=? AND user_id=?";
  connection.query(
    deleteFavParkQuery,
    [req.body.params.park_id, req.body.params.user_id],
    (err, results) => {
      if (err) {
        console.log("failed" + err);
        res.sendStatus(500);
        return;
      }
      res.end();
    }
  );
});

app.post("/api/reportPark", (req, res) => {
  const insertReportParkQuery =
    "INSERT INTO reports (park_id, issue) VALUES (?, ?)";
  connection.query(
    insertReportParkQuery,
    [req.body.params.park_id, req.body.params.reportIssue],
    (err, results) => {
      if (err) {
        console.log("failed" + err);
        res.sendStatus(500);
        return;
      }
      res.end();
    }
  );
});

app.post("/api/getProfileParks", async (req, res) => {
  console.log("body is: ", req.body);
  var tempString = JSON.stringify(req.body.userFavs);

  var inQuerySet = tempString
    .split(/[\{\[]/)
    .join("(")
    .split(/[\}\]]/)
    .join(")");
  const queryString = `select * from ontario_parks where id in ${inQuerySet}`;

  connection.query(queryString, [inQuerySet], (err, results) => {
    if (err) {
      console.log("failed" + err);
      res.sendStatus(500);
      return;
    }
    const lat = req.body.lat;
    const lng = req.body.lng;
    var parkData = JSON.parse(JSON.stringify(results));

    console.log(parkData);

    for (var parkKey in parkData) {
      park = parkData[parkKey];
      park.distance =
        6371 *
        Math.acos(
          Math.cos(toRadians(lat)) *
            Math.cos(toRadians(park.lat)) *
            Math.cos(toRadians(park.lng) - toRadians(lng)) +
            Math.sin(toRadians(lat)) * Math.sin(toRadians(park.lat))
        );
    }

    res.send(parkData);
  });
});

app.post("/api/getProfileParksWeather", async (req, res) => {
  var parkData = req.body.parkData;
  var userTime = req.body.userTime;

  parkDataLength = Object.keys(parkData).length;

  let weatherData = parkData.map((park) =>
    getIndividualParkWeatherAxios(park, userTime, weatherKey1)
  );
  await Promise.all(weatherData);

  for (let park in parkData) {
    park = parkData[park];
    console.log(park.id);
  }

  var phaseInfo = getMoon(userTime);

  var moonType = getMoonPhaseString(phaseInfo.phase);

  let reply = {
    parks: parkData,
    moonFraction: phaseInfo.fraction,
    moonPhase: phaseInfo.phase,
    moonType: moonType,
    stellarData: {},
  };
  res.send(reply);
});

app.post("/api/getParkData", async (req, res) => {
  console.log("GET HERE? ");
  //STEP 1: PARSE USER FORM DATA
  const lat = req.body.lat;
  const lng = req.body.lng;
  const dist = req.body.dist;
  const lightpol = req.body.lightpol;
  const userTime = new Date(req.body.utime);
  const numResults = req.body.numResults ? req.body.numResults : 100; //Fallback number of results to return

  //STEP 2: GET PARKS FROM DATABASE USING USER INPUT PARAMS
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

  console.log("Database query success");

  let totalResults = initialResults.length;
  if (initialResults.length > numResults) {
    initialResults = initialResults.slice(0, numResults);
  }
  let shownResults = initialResults.length;
  var parkDataJSON = JSON.parse(JSON.stringify(initialResults));

  //STEP 3 : GET PARKIDS FOR REVIEWS ARRAY
  var reviewIDsOriginal = [];

  for (var i = 0; i < initialResults.length; i++) {
    reviewIDsOriginal.push(initialResults[i].id);
  }

  var reviewIDs = JSON.stringify(reviewIDsOriginal);
  var inParkIDSet = reviewIDs
    .split(/[\{\[]/)
    .join("(")
    .split(/[\}\]]/)
    .join(")");

  const allReviewsQuery = `select AVG(score)as avgScore,count(*) as numReviews,p_id from reviews where p_id in ${inParkIDSet} group by p_id`;
  if (!(reviewIDsOriginal && reviewIDsOriginal.length)) {
    res.sendStatus(204);
    return;
  }

  try {
    var reviewsResults = await new Promise((resolve, reject) => {
      connection.query(allReviewsQuery, [inParkIDSet], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  } catch (err) {
    console.log("failed" + err);
    res.sendStatus(500);
    return;
  }

  var reviewsJSON = JSON.parse(JSON.stringify(reviewsResults));

  for (var i = 0; i < parkDataJSON.length; i++) {
    parkDataJSON[i].weather = {};
    for (var x = 0; x < reviewsJSON.length; x++) {
      if (reviewsJSON[x].p_id == parkDataJSON[i].id) {
        parkDataJSON[i].avgScore = reviewsJSON[x].avgScore;
        parkDataJSON[i].numReviews = reviewsJSON[x].numReviews;
      }
    }
  }

  parkDataJSON = await getClusterParkWeatherData(
    parkDataJSON,
    userTime,
    weatherKey1
  );

  //STEP 8B: GET MOON SUN DATA
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

  //STEP 9: FORMAT RESPONSE JSON
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

  //STEP 10: SEND DATA TO FRONT-END
  res.send(reply);
});

//note, res.send sends the HTTP response, res.end ends the response process
app.post("/results.html", (req, res) => {
  //get fields from forms
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

      //res.send(results)
      res.render("results.ejs", {
        location: [lat, lng],
        parks: results,
        mapAPIKey: mapsKey1,
      });
      res.end();
    }
  );
});

//full park info link pages
app.get("/park/:id", function (req, res) {
  var id = req.params.id;
  const lat = req.body.lat;
  const lng = req.body.lng;
  //get info for id
  const queryString =
    "SELECT name, light_pol, lat, lng from ontario_parks WHERE id=?";
  connection.query(queryString, id, (err, parkInfo) => {
    if (err) {
      console.log("failed" + err);
      res.sendStatus(500);
      return;
    }
    res.render("park.ejs", {
      //parkInfo: parkInfo
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
