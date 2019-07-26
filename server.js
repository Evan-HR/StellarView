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
app.use("/public", express.static("public"));
//app.use(express.static(__dirname + '/public'));

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
					}
					else {
						res.sendStatus(204);
					}
				}
			}
		);
	} );



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

// passport.serializeUser(function(user, done){
//     console.log('OK')//is show in console
//     done(null, user.id);
// });

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

//format "2014-02-17T00:00-0500", ISO 8601
function getMoon() {
	var now = new Date();
	var isoDate = now.toISOString();
	isoDate = new Date(isoDate);
	//console.log("date is:"+isoDate);
	//use phase_hunt to get next dates,

	//var phaseDates = lune.phase_hunt(isoDate);
	var phaseInfo = lune.phase(isoDate);
	return phaseInfo;
}

function toRadians(angle) {
	console.log("RADIANS FUNC RAN!!?!?!?!?");
	return angle * (Math.PI / 180);
}

function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

app.post("/api/getProfileParks", (req, res) => {
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

		for (var park in parkData) {
			park = parkData[park];
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
			var percentMoon = parseFloat(phaseInfo.illuminated) * 100;

			if (inRange(percentMoon, 0, 25)) {
				moonType = "New Moon";
			} else if (inRange(percentMoon, 25, 50)) {
				moonType = "First Quarter";
			} else if (inRange(percentMoon, 50, 75)) {
				moonType = "Full Moon";
			} else if (inRange(percentMoon, 75, 100)) {
				moonType = "Last Quarter";
			}

			park.moon = percentMoon;
			park.moonType = moonType;

			//axios goes here normally
		}

		res.send(parkData);

		//res.send(getParkWeatherAxios(parkData));
	});
});

app.post("/api/getProfileParksWeather", (req, res) => {
	console.log("getprofparks got here");

	console.log("getprofileparksweather body: ", req.body[0].name);
	var parkData = req.body;

	parkDataLength = Object.keys(parkData).length;
	for (let park in parkData) {
		park = parkData[park];
		console.log(park.id);
		//weather
		weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${
			park.lat
		}&lon=${park.lng}&appid=${weatherKey1}`;
		var counter = 0;
		axios
			.get(weatherURL)
			.then(function(response) {
				counter = counter + 1;
				console.log("counter is: " + counter);
				console.log("currently appending to: ", park.name);
				park.clouds = response.data.clouds.all;
				park.cloudDesc = "dunno lmao";
				park.humidity = response.data.main.humidity;

				if (counter == parkDataLength) {
					console.log("final park data is :", parkData);
					res.send(parkData);
				}
			})
			.catch(function(response) {
				console.log(response);
			});
	}
});

function getParkWeatherAxios(parkData) {
	parkDataLength = Object.keys(parkData).length;
	for (var park in parkData) {
		park = parkData[park];
		console.log(park.id);
		//weather
		weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${
			park.lat
		}&lon=${park.lng}&appid=${weatherKey1}`;
		var counter = 0;
		axios
			.get(weatherURL)
			.then(function(response) {
				counter = counter + 1;
				console.log("counter is: " + counter);
				//console.log("cloud log is: ",response.data.clouds.all)
				park.clouds = response.data.clouds.all;
				park.cloudDesc = "dunno lmao";
				park.humidity = response.data.main.humidity;

				if (counter == parkDataLength) {
					console.log("final park data is :", parkData);
					return parkData;
				}
			})
			.catch(function(response) {
				console.log(response);
			});
	}
}

app.post("/api/getParks", (req, res) => {

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
			var weatherJSON = JSON.parse(JSON.stringify(results));

			var weatherArr = [];
			weatherURL = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lng}&cnt=50&appid=${weatherKey1}`;
			axios
				.get(weatherURL)
				.then(function(response) {
					for (var i = 0; i < response.data.list.length; i++) {
						var elem = response.data.list[i];
						//console.log("elem is: ", elem);
						var city = {};
						city.name = elem.name;
						city.clouds = elem.clouds.all;
						city.cloudDesc = elem.weather[0].description;
						city.humidity = elem.main.humidity;
						city.lat = elem.coord.lat;
						city.lng = elem.coord.lon;

						//console.log("city is:", city);

						weatherArr.push(city);
						//console.log("weather arr is : ", weatherArr);
					}

					// weather assigning:
					for (var i = 0; i < weatherJSON.length; i++) {
						var minDist = 300000; // higher than any coord distance
						var closestCity = -1; //variable represents index of closest city; initialized as -ve, will throw err if no closer city
						for (var j = 0; j < weatherArr.length; j++) {
							var cityLat = parseFloat(weatherArr[j].lat);
							var cityLng = parseFloat(weatherArr[j].lng);
							var parkLat = parseFloat(weatherJSON[i].lat);
							var parkLng = parseFloat(weatherJSON[i].lng);

							var theta = parkLng - cityLng;
							var dist =
								Math.sin((parkLat * Math.PI) / 180) *
									Math.sin((cityLat * Math.PI) / 180) +
								Math.cos((parkLng * Math.PI) / 180) *
									Math.cos((cityLng * Math.PI) / 180) *
									Math.cos((theta * Math.PI) / 180);
							dist = Math.acos(dist);
							dist = (dist * 20014.1238528) / Math.PI;
							//console.log(dist);

							var distance = Math.sqrt(
								Math.pow(cityLat - parkLat, 2) +
									Math.pow(cityLng - parkLng, 2)
							);

							if (distance < minDist) {
								minDist = distance;
								closestCity = j;
							}
							weatherJSON[i].clouds =
								weatherArr[closestCity].clouds; // PARKS JSON FOR i GETS NEW COMPONENT 'weather' WITH DATA FROM CLOSEST CITY
							weatherJSON[i].humidity =
								weatherArr[closestCity].humidity;
							weatherJSON[i].cloudDesc =
								weatherArr[closestCity].cloudDesc;
							weatherJSON[i].city = weatherArr[closestCity].name;
						}

						// can u get the km distance between each park
						//like what does 'closest' mean do we know that yet?
						// lets look at some of the #s
					}

					//moon stuff
					var phaseInfo = getMoon();
					var moonType = "";
					var percentMoon = parseFloat(phaseInfo.illuminated) * 100;

					if (inRange(percentMoon, 0, 25)) {
						moonType = "New Moon";
					} else if (inRange(percentMoon, 25, 50)) {
						moonType = "First Quarter";
					} else if (inRange(percentMoon, 50, 75)) {
						moonType = "Full Moon";
					} else if (inRange(percentMoon, 75, 100)) {
						moonType = "Last Quarter";
					}

					let reply = {
						parks: weatherJSON,
						moonPercent: percentMoon,
						moonType: moonType
					};
					console.log("Response ", reply);
					res.send(reply);
					//res.send(results);
				})

				.catch(function(response) {
					console.log(response);
				});

		}
	);
});

