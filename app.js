//this is the entry point (app.js)


//bring in both express and mysql
const express = require('express');
const mysql = require("mysql");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const expressValidator = require('express-validator');
const http = require('http');



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
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'parks'
    });
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
app.use(express.static('./public'));




app.get('/register', function (req, res) {
    res.render('register.ejs', { registerResponse: "Registration", errors: "" });
});

app.post('/register', function (req, res) {

    //client-side validation
    req.checkBody('username', 'Username cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 3-15 characters long.').len(3, 15);
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
        var username = req.body.username;
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
                    const insertQuery = "INSERT into users (username, email, password) VALUES (?,?,?)";
                    getConnection().query(insertQuery, [username, email, password], (err, results, fields) => {
                        if (err) {
                            console.log("failed" + err);
                            res.sendStatus(500);
                            return;
                        } else {
                            res.render('register.ejs', { registerResponse: "Registration Complete", errors: "" });
                        }


                    });
                }

            }
        });

    }


});

//----------------------BEGIN LOGIN--------------------------------------//
app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;

});
//----------------------END LOGIN--------------------------------------//

//- - - - - - - - - - - - - - - BEGIN WEATHER - - - - - - - - - - - - - - - - - - - -//





function EvansEvanEvan(lat, lon) {
    // call the api url with form input
    var apiurl = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=50&appid=${weatherKey1}`;

    // code from https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
    http.get(apiurl, (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          weatherData = (JSON.parse(data));
          return weatherData;
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });

    // use result lat/lon coords and find closest city coords from weather
    

    // associate humidity and cloud cover info from closest city for each result location


}
var dataWeather = EvansEvanEvan(43,-79);


// - - - - - - - - - - - - - - - END WEATHER - - - - - - - - - - - - - - - - - - - //

//dynamically populate homepage
app.get(['/', '/form.html'], function (req, res) {
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


