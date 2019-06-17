
//bring in both express and mysql
const express = require('express');
const mysql = require("mysql");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

//authentication variables
var session = require('express-session');
var passport = require('passport');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var cookieParser = require('cookie-parser');




//env variables
require('dotenv').config();
const mapsKey1 = process.env.DUSTINMAPKEY;
const weatherKey1 = process.env.EVANWEATHERKEY;

//set up simple express server
const app = express();



//for dynamic html generation
app.set('view engine', 'ejs');
//Serving css
app.use('/public', express.static('public'));
//app.use(express.static(__dirname + '/public'));

//arbitrary port 3000
app.listen('3000', () => {
    console.log('Server started on port 3000');
});

//tidy connection code
function getConnection() {
    return mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'parks',
            multipleStatements: true

        }
    );
}


//middleware, this code is looking at the request for you, 
//useful for getting data passed into the form 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(morgan('short'));


//note: get - get info from server, post - post info to server

//serve public form to browser
//application server (express) is serving all the files in the directory
app.use(cookieParser());
app.use(express.static('./public'));

//session stuff, creates the cookie
//to view cookie, check browser console and go to APPLICATION --> cookies for chrome
app.use(session({
    //secret is like the salt, "signed"
    secret: 'J94js0f2s4J4jsjf',
    resave: false,
    //only logged/registered users have cookies 
    saveUninitialized: false,
    //cookie: { secure: true }
}));
//creates passport sessions, grabs cookies
app.use(passport.initialize());
app.use(passport.session());




app.get('/register', function (req, res) {
    res.render('register.ejs', { registerResponse: "Registration", errors: "" });
});

app.post('/register', function (req, res) {

    //client-side validation
    req.checkBody('name', 'Preferred name cannot be empty.').notEmpty();
    req.checkBody('name', 'Preferred name must be between 2-25 characters long.').len(2, 25);
    req.checkBody('email', "The email you entered is invalid. Please try again.").isEmail();
    req.checkBody('email', "Email address must be between 8-100 characters long.").len(8, 100);
    req.checkBody('password2', 'Passwords do not match. Please try again.').equals(req.body.password1);
    const errors = req.validationErrors();

    if (errors) {
        console.log(`errors: ${JSON.stringify(errors)}`);
        res.render('register', {
            registerResponse: 'Registration Failed',
            errors: errors
        });
    } else {
        var name = req.body.name;
        var email = req.body.email;
        //check if same
        var password = req.body.password1;

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
                    var jsonString = '[{"msg" : "Email already registered.  Please try again."}]';
                    var emailErrorJSON = JSON.parse(jsonString);
                    console.log("errors is: ");
                    console.log(emailErrorJSON.msg);
                    res.render('register', {
                        registerResponse: 'Registration Failed',
                        errors: emailErrorJSON
                    });
                }
                else {
                    //proceed with INSERT query
                    console.log("no duplicate emails");
                    //query info
                    const insertQuery = "INSERT into users (name, email, password) VALUES (?,?,?); SELECT LAST_INSERT_ID() as user_id;";

                    //wrap insert query with bcrypt
                    bcrypt.hash(password, saltRounds, function (err, hash) {
                        getConnection().query(insertQuery, [name, email, hash], (err, results, fields) => {
                            if (err) {
                                console.log("failed" + err);
                                res.sendStatus(500);
                                return;
                            } else {

                                console.log("THIS RAN!!!!!!!!!!!!!!");

                                console.log("user ID is: " + results[1][0].user_id);
                                const user_id = results[1][0].user_id;
                                //should be user_id that was just created
                                //login function returns data to serializeUser function below
                                req.login(user_id, function (err) {
                                    //will return successfully registered user to homepage
                                    res.redirect('/');
                                });


                            }
                        });
                    });
                }
            }
        });
    }
});


//use this any time you want to WRITE info to a session
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});
//use this any time you want to GET info to a session
passport.deserializeUser(function (user_id, done) {
    //User.findById(id, function (err, user) {
    //^ this line automatic in mongo, hopefully no issues with mySQL
    done(null, user_id);

});


//----------------------BEGIN LOGIN--------------------------------------//
app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;

});
//----------------------END LOGIN--------------------------------------//



//dynamically populate homepage
app.get(['/', '/form.html'], function (req, res) {
    console.log(req.user);
    console.log("are we authenticated??? "+req.isAuthenticated());
    res.render('form.ejs', { name: "dustin" });
});

//full park info link pages
app.get('/park/:id', function (req, res) {
    var id = req.params.id;
    const lat = req.body.lat;
    const lng = req.body.lng;
    //get info for id
    const queryString = "SELECT name, light_pol, lat, lng from ontario_parks WHERE id=?";
    getConnection().query(queryString, id, (err, parkInfo) => {
        if (err) {
            console.log("failed" + err);
            res.sendStatus(500);
            return;
        }
        res.render('park.ejs', {
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



//note, res.send sends the HTTP response, res.end ends the response process
app.post('/results.html', (req, res) => {
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
    const queryString = "SELECT *, ( 6371 * acos( cos( radians( ? ) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( lat ) ) ) ) AS distance FROM ontario_parks HAVING distance <= ? AND light_pol <= ? ORDER BY distance ASC";
    getConnection().query(queryString, [lat, lng, lat, dist, lightpol], (err, results) => {
        if (err) {
            console.log("failed" + err);
            res.sendStatus(500);
            return;
        }


        //res.send(results)
        res.render('results.ejs', { location: [lat, lng], parks: results, mapAPIKey: mapsKey1 });
        res.end();
    });

});


