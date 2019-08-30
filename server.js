//bring in both express and mysql
const express = require("express");
const mysql = require("mysql");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");
//const http = require('http');
const request = require("request");
const axios = require("axios");
const suncalc = require("suncalc");
const clustering = require("density-clustering");
const geolib = require("geolib");
//moon phases
var lune = require("lune");

//authentication variables
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MySQLStore = require("express-mysql-session")(session);
var bcrypt = require("bcrypt");
const saltRounds = 10;
var cookieParser = require("cookie-parser");

//env variables
require("dotenv").config();
const mapsKey1 = process.env.DUSTINMAPKEY;
const weatherKey1 = process.env.REACT_APP_EVANWEATHERKEY;
const cookieKey = process.env.SECRET;

//set up simple express server
const app = express();
const port = process.env.PORT || 5000;

//for dynamic html generation
app.set("view engine", "ejs");
//Serving css
app.use(express.static(path.join(__dirname, "client", "build")));
//app.use(express.static(__dirname + '/public'));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
//arbitrary port 5000
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

//tidy connection code
function getConnection() {
	return mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "parks",
		multipleStatements: true
	});
}

//for sessions
var options = {
	host: "localhost",
	user: "root",
	password: "",
	database: "parks"
};

var sessionStore = new MySQLStore(options);

//middleware, this code is looking at the request for you,
//useful for getting data passed into the form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(morgan("short"));

//note: get - get info from server, post - post info to server

//serve public form to browser
//application server (express) is serving all the files in the directory
app.use(cookieParser());
app.use(express.static("./public"));

//session stuff, creates the cookie
//to view cookie, check browser console and go to APPLICATION --> cookies for chrome
//cookie: secure true is recommended by requires https connection
app.use(
	session({
		//secret is like the salt, "signed"
		secret: cookieKey,
		resave: false,
		store: sessionStore,
		//only logged/registered users have cookies
		saveUninitialized: false,
		//cookie: { secure: true }
		cookie: { httpOnly: false }
	})
);

/**
 * creates passport sessions, grabs cookies
 * PLEASE MAKE SURE THIS IS ABOVE ANY OTHER PASSPORT FUNCTION
 */
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});

//using passport to authenticate login
//adjust usernameField to email because this middleware
//mandates key word "username"
passport.use(
	new LocalStrategy(
		{
			usernameField: "email"
		},
		function(username, password, done) {
			const passQuery = "SELECT id,password from users WHERE email=?";
			getConnection().query(
				passQuery,
				[username],
				(err, results, fields) => {
					//passport handles this error
					if (err) {
						done(err);
					}
					//doesn't exist
					if (results.length === 0) {
						done(null, false);
					} else {
						//success query
						console.log("success login");
						console.log(results[0].password.toString());
						const hash = results[0].password.toString();

						//used to be user.results[0].id
						bcrypt.compare(password, hash, function(err, response) {
							if (response === true) {
								return done(null, results[0].id);
							} else {
								return done(null, false);
							}
						});
					}
				}
			);
		}
	)
);

app.get("/logout", function(req, res) {
	console.log("LOG OUT GOT HERE!???!?");
	req.logout();
	//destroys session from database
	req.session.destroy(() => {
		res.clearCookie("connect.sid");
		res.redirect("/");
	});
});

//local strategy cuz database is localhost
//----------------------BEGIN LOGIN--------------------------------------//
app.post(
	"/api/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/api/login"
	})
);
//----------------------END LOGIN--------------------------------------//
app.get("/api/getUserFavSpots", function(req, res) {
	const getFavSpotsQuery =
		"SELECT park_id from favorite_parks where user_id = ?";
	getConnection().query(
		getFavSpotsQuery,
		[req.session.passport.user],
		(err, favSpots) => {
			console.log("favspots pre array is: ", favSpots);
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

					console.log("tempSpots is: ", tempSpots);
					res.send(tempSpots);
				} else {
					res.sendStatus(204);
				}
			}
		}
	);
});

//get reviews from db
app.get("/api/getReviews", function(req, res) {
	const getReviewQuery =
		"SELECT name, score, review from reviews where p_id = ?";

	getConnection().query(
		getReviewQuery,
		[req.query.parkID],
		(err, reviews) => {
			if (reviews.length > 0) {
				if (err) {
					console.log("failed" + err);
					res.sendStatus(500);
					return;
				} else {
					console.log("REVIEWS about to be sent: ", reviews);
					var reviewsJSON = JSON.parse(JSON.stringify(reviews));
					var score = 0;
					var reviewsLength = Object.keys(reviewsJSON).length;
					console.log("num reviews: " + reviewsLength);
					for (let review in reviewsJSON) {
						review = reviewsJSON[review];
						console.log("score is : ", review.score);
						score = score + review.score;
					}

					var averageScore =
						Math.round((score / reviewsLength) * 10) / 10;
					console.log("average score truncated is: " + averageScore);

					let reply = {
						reviews: reviews,
						averageScore: averageScore,
						numReviews: reviewsLength
					};

					res.send(reply);
				}
			} else {
				res.sendStatus(204);
			}
		}
	);
});

//put review to database
app.post("/api/storeReview", function(req, res) {
	console.log("review on submission from client: ", req.body);
	console.log(req.body.name);
	console.log(req.body.user_id);
	console.log("park id is : " + req.body.parkID);

	//order in query :p_id, score, name, user_id, review
	//id is autoincrement so dont worry about that
	const insertReviewQuery =
		"INSERT INTO reviews (p_id, score, name, user_id, review) VALUES (?, ?, ?, ?, ?)";

	getConnection().query(
		insertReviewQuery,
		[
			req.body.parkID,
			req.body.score,
			req.body.name,
			req.body.user_id,
			req.body.review
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

app.post("/api/register", function(req, res) {
	//client-side validation
	req.checkBody("name", "Preferred name cannot be empty.").notEmpty();
	req.checkBody(
		"name",
		"Preferred name must be between 2-25 characters long."
	).len(2, 25);
	req.checkBody(
		"email",
		"The email you entered is invalid. Please try again."
	).isEmail();
	req.checkBody(
		"email",
		"Email address must be between 5-100 characters long."
	).len(5, 100);
	req.checkBody(
		"password2",
		"Passwords do not match. Please try again."
	).equals(req.body.password1);
	const errors = req.validationErrors();

	if (errors) {
		res.status(422).json({ errors: errors });
	} else {
		var name = req.body.name;
		var email = req.body.email;
		//check if same
		var password = req.body.password1;

		console.log("name email and password: " + name, email, password);

		const emailQuery = "SELECT * from users WHERE email=?";
		getConnection().query(emailQuery, [email], (err, results, fields) => {
			if (err) {
				console.log("failed" + err);
				res.sendStatus(500);
				return;
			} else {
				if (results.length > 0) {
					//display error message
					console.log("GOT HERE???");
					var jsonString =
						'[{"msg" : "Email already registered.  Please try again."}]';
					var emailErrorJSON = JSON.parse(jsonString);
					console.log("errors is: ");
					console.log(emailErrorJSON.msg);
					res.status(422).json({ errors: emailErrorJSON });
				} else {
					//proceed with INSERT query, no duplicate emails

					const insertQuery =
						"INSERT into users (name, email, password) VALUES (?,?,?); SELECT LAST_INSERT_ID() as user_id;";

					//wrap insert query with bcrypt
					bcrypt.hash(password, saltRounds, function(err, hash) {
						getConnection().query(
							insertQuery,
							[name, email, hash],
							(err, results, fields) => {
								if (err) {
									console.log("failed" + err);
									res.sendStatus(500);
									return;
								} else {
									const user_id = results[1][0].user_id;
									req.login(user_id, function(err) {
										//will return successfully registered user to homepage
										res.redirect("/");
									});
								}
							}
						);
					});
				}
			}
		});
	}
});

//----------------------BEGIN AUTHENTICATION-----------------
passport.serializeUser(function(user_id, done) {
	done(null, user_id);
});
//use this any time you want to GET info to a session
passport.deserializeUser(function(user_id, done) {
	//User.findById(id, function (err, user) {
	//^ this line automatic in mongo, hopefully no issues with mySQL
	done(null, user_id);
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(
			`req.session.passport.user: ${JSON.stringify(req.session.passport)}`
		);

		if (req.isAuthenticated()) return next();
		res.redirect("/api/login");
	};
}
//----------------------END AUTHENTICATION-----------------

app.get("/api/getUserAuth", (req, res) => {
	console.log("FIRST: GETUSERAUTH");
	//if logged in...
	if (req.session.passport) {
		console.log("true auth got here");
		res.send(JSON.parse(true));
	} else {
		console.log("false auth got here");
		res.send(JSON.parse(false));
	}
});

//post register user name: req.session.passport.user  (will give 81)
//post login user name: req.session.passport.user  (will give 81)
app.get("/api/getUserInfo", (req, res) => {
	console.log("SECOND: getuserinfO");
	const nameQuery = "SELECT name from users WHERE id=?";
	if (req.session.passport) {
		getConnection().query(
			nameQuery,
			[req.session.passport.user],
			(err, profileInfo) => {
				if (err) {
					console.log("failed" + err);
					res.sendStatus(500);
					return;
				} else {
					console.log("GET HERE?????????????");

					console.log("profile info: ", profileInfo);

					tempName = profileInfo[0].name;
					const tempJSON = `{ "firstName": "${
						profileInfo[0].name
					}", "isAuth": ${req.isAuthenticated()}, "userID": ${
						req.session.passport.user
					} }`;
					console.log("finalJSON is: " + tempJSON);
					res.send(tempJSON);
				}
			}
		);
	}
});

app.get("/api/getUserReviews", (req, res) => {
	const getUserReviewQuery = "SELECT p_id from reviews WHERE user_id=?";
	//if logged in...
	if (req.session.passport) {
		getConnection().query(
			getUserReviewQuery,
			[req.session.passport.user],
			(err, reviewResults) => {
				//console.log("rev results",reviewResults);

				if (err) {
					console.log("failed" + err);
					res.sendStatus(500);
					return;
				} else {
					if (reviewResults.length > 0) {
						tempReviews = [];
						for (var i = 0; i < reviewResults.length; i++) {
							tempReviews.push(reviewResults[i].p_id);
						}

						console.log("reviews is: ", tempReviews);
						res.send(tempReviews);
					} else {
						res.sendStatus(204);
					}
				}
			}
		);
	}
});

//full park info link pages
app.get("/park/:id", function(req, res) {
	var id = req.params.id;
	const lat = req.body.lat;
	const lng = req.body.lng;
	//get info for id
	const queryString =
		"SELECT name, light_pol, lat, lng from ontario_parks WHERE id=?";
	getConnection().query(queryString, id, (err, parkInfo) => {
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
			mapAPIKey: mapsKey1
		});
		res.end();
	});
});

app.post("/api/postFavSpot", (req, res) => {
	console.log("body: ", req.body);
	console.log("user_id: " + req.body.params.user_id);
	console.log("park_id: " + req.body.params.park_id);

	const insertFavParkQuery =
		"INSERT INTO favorite_parks (park_id, user_id) VALUES (?, ?)";
	getConnection().query(
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

//note, res.send sends the HTTP response, res.end ends the response process
app.post("/results.html", (req, res) => {
	console.log("Latitude entered: " + req.body.lat);
	console.log("Longitude entered: " + req.body.lng);
	console.log("Maximum Distance: " + req.body.dist);
	//console.log(mapsKey1);
	//get fields from forms
	const lat = req.body.lat;
	const lng = req.body.lng;
	const dist = req.body.dist;
	const lightpol = req.body.lightpol;

	//6371 is km, 3959 is miles
	const queryString =
		"SELECT *, ( 6371 * acos( cos( radians( ? ) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( lat ) ) ) ) AS distance FROM ontario_parks HAVING distance <= ? AND light_pol <= ? ORDER BY distance ASC";
	getConnection().query(
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
				mapAPIKey: mapsKey1
			});
			res.end();
		}
	);
});

//format "2014-02-17T00:00-0500", ISO 8601
function getMoonProfile(userTime) {
	var phaseInfo = lune.phase(userTime);
	return phaseInfo;
}

function getMoon(userTime) {
	var time = new Date(userTime);

	//var phaseDates = lune.phase_hunt(isoDate);
	var phaseInfo = suncalc.getMoonIllumination(time);
	return phaseInfo;
}

function toRadians(angle) {
	console.log("RADIANS FUNC RAN!!?!?!?!?");
	return angle * (Math.PI / 180);
}

function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

app.post("/api/getProfileParks", async (req, res) => {
	console.log("body is: ", req.body);
	var tempString = JSON.stringify(req.body.userFavs);
	//console.log(tempString)
	var inQuerySet = tempString
		.split(/[\{\[]/)
		.join("(")
		.split(/[\}\]]/)
		.join(")");
	console.log("userFAVS query is: ", inQuerySet);
	const queryString = `select * from ontario_parks where id in ${inQuerySet}`;

	getConnection().query(queryString, [inQuerySet], (err, results) => {
		if (err) {
			console.log("failed" + err);
			res.sendStatus(500);
			return;
		}
		console.log("results is: ", results);
		const lat = req.body.lat;
		const lng = req.body.lng;
		var parkData = JSON.parse(JSON.stringify(results));

		// weatherResults = {}
		// for (var parkKey in parkData) {

		// }

		// await Promise.all()

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

			//moon stuff
			var phaseInfo = getMoon(req.body.userTime);
			var moonType = "";
			var percentMoon = phaseInfo.phase;

			if (
				inRange(percentMoon, 0, 0.125) ||
				inRange(percentMoon, 0.875, 1)
			) {
				moonType = "New Moon";
			} else if (inRange(percentMoon, 0.125, 0.375)) {
				moonType = "First Quarter";
			} else if (inRange(percentMoon, 0.375, 0.625)) {
				moonType = "Full Moon";
			} else if (inRange(percentMoon, 0.625, 0.875)) {
				moonType = "Last Quarter";
			}

			park.moon = phaseInfo.fraction;
			park.moonType = phaseInfo.phase;

			//axios goes here normally
		}

		res.send(parkData);

		//res.send(getParkWeatherAxios(parkData));
	});
});

app.post("/api/getProfileParksWeather", async (req, res) => {
	console.log("getprofparks got here");

	//console.log("getprofileparksweather body: ", req.body.parkData[0].name);
	console.log("ParkData body: ", req.body);
	var parkData = req.body.parkData;
	var userTime = req.body.userTime;
	console.log("User time is:", req.body.userTime);

	parkDataLength = Object.keys(parkData).length;

	let weatherData = parkData.map(park => getParkWeatherAxios(park, userTime));
	await Promise.all(weatherData);
	console.log("Weather results:", weatherData);

	for (let park in parkData) {
		park = parkData[park];
		console.log(park.id);
	}

	res.send(parkData);
});

function getParkWeatherAxios(park, userTime) {
	weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${park.lat}&lon=${park.lng}&appid=${weatherKey1}`;
	console.log(weatherURL);

	var times = suncalc.getTimes(new Date(userTime), park.lat, park.lng);

	console.log("Sun data:", times);

	var nightTime = new Date(times.night);
	console.log(nightTime);

	return axios
		.get(weatherURL)
		.then(function(response) {
			//console.log("Weather data:", response.data);

			response = response.data;

			let weatherInstance = null;

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
					console.log(
						"Success! Looking at ",
						i,
						":",
						response.list[i]
					);
					weatherInstance = response.list[i];
					break;
				}
			}

			console.log(weatherInstance);

			park.weather = {
				time: new Date(weatherInstance.dt_txt).getTime(),
				city: response.city.name,
				clouds: weatherInstance.clouds.all,
				cloudDesc: weatherInstance.weather[0].description,
				humidity: weatherInstance.main.humidity,
				temp: weatherInstance.main.temp
			};
			// park.clouds = response.data.clouds.all;
			// park.cloudDesc = "dunno lmao";
			// park.humidity = response.data.main.humidity;
			return park;
		})
		.catch(function(response) {
			console.log(response);
			return false;
		});
}

app.post("/api/getParkData", async (req, res) => {
	//STEP 1: PARSE USER FORM DATA
	const lat = req.body.lat;
	const lng = req.body.lng;
	const dist = req.body.dist;
	const lightpol = req.body.lightpol;
	const utime = new Date(req.body.utime);

	//STEP 2: GET PARKS FROM DATABASE USING USER INPUT PARAMS
	//6371 is km, 3959 is miles
	const queryFromUserForm =
		"SELECT *, ( 6371 * acos( cos( radians( ? ) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( lat ) ) ) ) AS distance FROM ontario_parks HAVING distance <= ? AND light_pol <= ? ORDER BY distance ASC";
	getConnection().query(
		queryFromUserForm,
		[lat, lng, lat, dist, lightpol],
		(err, initialResults) => {
			if (err) {
				console.log("failed" + err);
				res.sendStatus(500);
				return;
			}
			var parkDataJSON = JSON.parse(JSON.stringify(initialResults));

			//STEP 3 : GET PARKIDS FOR REVIEWS ARRAY
			var reviewIDs = [];

			for (var i = 0; i < initialResults.length; i++) {
				reviewIDs.push(initialResults[i].id);
			}

			console.log("reviewIDS: ", reviewIDs);
			var reviewIDs = JSON.stringify(reviewIDs);
			var inParkIDSet = reviewIDs
				.split(/[\{\[]/)
				.join("(")
				.split(/[\}\]]/)
				.join(")");

			console.log("reviewIDS after processing: ", inParkIDSet);

			//STEP 4: GET USER REVIEWS FROM PARKS THAT HAVE BEEN RETURNED IN STEP 2

			const allReviewsQuery = `select AVG(score)as avgScore,count(*) as numReviews,p_id from reviews where p_id in ${inParkIDSet} group by p_id`;

			getConnection().query(
				allReviewsQuery,
				[inParkIDSet],
				async (err, reviewsResults) => {
					if (err) {
						console.log("failed" + err);
						res.sendStatus(500);
						return;
					}
					//console.log("results is: ", reviewsResults);
					var reviewsJSON = JSON.parse(
						JSON.stringify(reviewsResults)
					);
					console.log("reviews is: ", reviewsJSON);

					for (var i = 0; i < parkDataJSON.length; i++) {
						parkDataJSON[i].weather = {};
						for (var x = 0; x < reviewsJSON.length; x++) {
							if (reviewsJSON[x].p_id == parkDataJSON[i].id) {
								console.log(
									"found matching ID! ",
									reviewsJSON[x].p_id
								);
								parkDataJSON[i].avgScore =
									reviewsJSON[x].avgScore;
								parkDataJSON[i].numReviews =
									reviewsJSON[x].numReviews;
							}
						}
					}

					//STEP 5: GET WEATHER FOR PARKS

					//Dataset is array of park coordinates
					var parkCoordinates = [];
					for (var i = 0; i < parkDataJSON.length; i++) {
						parkCoordinates[i] = [
							parkDataJSON[i].lat,
							parkDataJSON[i].lng
						];
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
					var clusters = kmeans.run(
						parkCoordinates,
						clusterCount,
						kmeansDistance
					);

					//Find coordinates at the center of each cluster
					let clusterCentroids = [];
					for (
						var clusterNum = 0;
						clusterNum < clusters.length;
						clusterNum++
					) {
						//Add park coordinates to the cluster the park is in
						let clusterCoordinates = [];
						for (var i = 0; i < clusters[clusterNum].length; i++) {
							clusterCoordinates.push({
								lat: parkDataJSON[clusters[clusterNum][i]].lat,
								lng: parkDataJSON[clusters[clusterNum][i]].lng
							});
						}
						//console.log(clusterCoordinates);
						let clusterCentroid = geolib.getCenter(
							clusterCoordinates
						);
						//console.log(clusterCentroid);

						//Calculate each park's distance to cluster center
						let clusterDist = [];
						for (var i = 0; i < clusters[clusterNum].length; i++) {
							parkDataJSON[
								clusters[clusterNum][i]
							].cluster = clusterNum;
							clusterDist.push(
								geolib.getDistance(
									{
										lat:
											parkDataJSON[
												clusters[clusterNum][i]
											].lat,
										lng:
											parkDataJSON[
												clusters[clusterNum][i]
											].lng
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
							clusterDist.reduce((a, b) => a + b) /
								clusterDist.length
						);

						//TODO: CHECK IF CLUSTERDIST IS OKAY
						clusterCentroids.push(clusterCentroid);
					}
					console.log(clusterCentroids);

					//Grab weather for each cluster
					let weatherInstance = null;
					let response = null;
					for (
						var clusterNum = 0;
						clusterNum < clusters.length;
						clusterNum++
					) {
						var times = suncalc.getTimes(
							new Date(utime),
							clusterCentroids[clusterNum].latitude,
							clusterCentroids[clusterNum].longitude
						);
						var nightTime = new Date(times.night);

						//If current time is past night-time use current weather
						if (utime > nightTime) {
							weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${clusterCentroids[clusterNum].latitude}&lon=${clusterCentroids[clusterNum].longitude}&appid=${weatherKey1}&units=metric`;

							response = await axios
								.get(weatherURL)
								.then(response => response.data)
								.catch(false);

							weatherInstance = response;

							for (
								var i = 0;
								i < clusters[clusterNum].length;
								i++
							) {
								parkDataJSON[
									clusters[clusterNum][i]
								].weather = {
									time: utime.getTime(),
									city: response.name,
									clouds: weatherInstance.clouds.all,
									cloudDesc:
										weatherInstance.weather[0].description,
									humidity: weatherInstance.main.humidity,
									temp: weatherInstance.main.temp,
									stationCoord: {
										lat: response.coord.lat,
										lng: response.coord.lon
									},
									stationDist:
										geolib.getDistance(
											{
												lat:
													parkDataJSON[
														clusters[clusterNum][i]
													].lat,
												lng:
													parkDataJSON[
														clusters[clusterNum][i]
													].lng
											},
											{
												lat: response.coord.lat,
												lng: response.coord.lon
											}
										) / 1000
								};
							}

							//Otherwise use forecast weather
						} else {
							weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${clusterCentroids[clusterNum].latitude}&lon=${clusterCentroids[clusterNum].longitude}&cnt=50&appid=${weatherKey1}&units=metric`;

							console.log(weatherURL);

							response = await axios
								.get(weatherURL)
								.then(response => response.data)
								.catch(false);

							//Go through the forecasts and find the closest one to nightfall
							for (var i = 0; i < response.cnt; i++) {
								console.log(
									new Date(response.list[i].dt_txt).getTime(),
									nightTime.getTime(),
									new Date(
										response.list[i].dt_txt
									).getTime() > nightTime.getTime()
								);
								if (
									new Date(
										response.list[i].dt_txt
									).getTime() > nightTime.getTime()
								) {
									//If the date before nightfall is closer to nightfall than the one after, pick the closer one
									let succInst = i;
									if (
										i > 0 &&
										Math.abs(
											new Date(
												response.list[i - 1].dt_txt
											) - nightTime.getTime()
										) <
											Math.abs(
												new Date(
													response.list[i].dt_txt
												).getTime() -
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
							for (
								var i = 0;
								i < clusters[clusterNum].length;
								i++
							) {
								parkDataJSON[
									clusters[clusterNum][i]
								].weather = {
									time: new Date(
										weatherInstance.dt_txt
									).getTime(),
									city: response.city.name,
									clouds: weatherInstance.clouds.all,
									cloudDesc:
										weatherInstance.weather[0].description,
									humidity: weatherInstance.main.humidity,
									temp: weatherInstance.main.temp,
									stationCoord: {
										lat: response.city.coord.lat,
										lng: response.city.coord.lon
									},
									stationDist:
										geolib.getDistance(
											{
												lat:
													parkDataJSON[
														clusters[clusterNum][i]
													].lat,
												lng:
													parkDataJSON[
														clusters[clusterNum][i]
													].lng
											},
											{
												lat: response.city.coord.lat,
												lng: response.city.coord.lon
											}
										) / 1000
								};
							}
						}
					}

					// console.log(weatherInstance);

					//console.log(clusters);

					var phaseInfo = getMoon(utime);

					let moonPercent = phaseInfo.fraction;
					var moonType;
					if (
						inRange(phaseInfo.phase, 0.9375, 1) ||
						inRange(phaseInfo.phase, 0, 0.0625)
					) {
						moonType = "New Moon";
					} else if (inRange(phaseInfo.phase, 0.0625, 0.1875)) {
						moonType = "Waxing Crescent";
					} else if (inRange(phaseInfo.phase, 0.1875, 0.3125)) {
						moonType = "First Quarter";
					} else if (inRange(phaseInfo.phase, 0.3125, 0.4375)) {
						moonType = "Waxing Gibbous";
					} else if (inRange(phaseInfo.phase, 0.4375, 0.5625)) {
						moonType = "Full Moon";
					} else if (inRange(phaseInfo.phase, 0.5625, 0.6875)) {
						moonType = "Waning Gibbous";
					} else if (inRange(phaseInfo.phase, 0.6875, 0.8125)) {
						moonType = "Last Quarter";
					} else if (inRange(phaseInfo.phase, 0.8125, 0.9375)) {
						moonType = "Waning Crescent";
					} else {
						moonType = "New Moon";
					}

					//STEP 9: FORMAT RESPONSE JSON
					let reply = {
						parks: parkDataJSON,
						moonFraction: phaseInfo.fraction,
						moonPercent: phaseInfo.phase,
						moonType: moonType
					};
					//console.log("Response ", reply);

					//STEP 10: SEND DATA TO FRONT-END
					res.send(reply);
				}
			);
		}
	);
});
