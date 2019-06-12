//this is the entry point (app.js)


//bring in both express and mysql
const express = require('express');
const mysql = require("mysql");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');



//env variables
require('dotenv').config();
const mapsKey1 = process.env.DUSTINMAPKEY;

//set up simple express server
const app = express();



//for dynamic html generation
app.set('view enginer', 'ejs');
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

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//middleware, this code is looking at the request for you, 
//useful for getting data passed into the form 
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(morgan('short'));


//note: get - get info from server, post - post info to server

//serve public form to browser
//application server (express) is serving all the files in the directory
app.use(express.static('./public'))


//----------------------BEGIN CRYPTO--------------------------------------//
'use strict';
var crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

//Store the result as the password and also store the salt along side.
function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}



//----------------------END CRYPTO--------------------------------------//

//login 
app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
    var salt;

    const saltQuery = 'SELECT salt FROM users WHERE username = ?';
    getConnection().query(saltQuery, username, (err, userSalt) => {
            if (err) {
                console.log("failed" + err)
                res.sendStatus(500)
                return
            }
            salt = userSalt[0].salt;
    console.log("salt from username:"+salt);
    //let so it can be accessed outside of this function (getConnection)
    let tempHashedPass = sha512(password, salt);
    tempHashedPass = tempHashedPass.passwordHash;
    console.log("hashed pass with salt is : " + tempHashedPass);
});


    const queryString = 'SELECT username,passwordhash FROM users WHERE username = ? AND passwordhash = ?';
    
	if (username && password) {

		getConnection().query(queryString, [username, tempHashedPass], function(error, results, fields) {
 
            if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = username;
				response.redirect('form.html');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});



//dynamically populate homepage
app.get(['/', '/form.html'], function (req, res) {
    res.render('form.ejs', { name: "dustin" });
})

//full park info link pages
app.get('/park/:id', function (req, res) {
    var id = req.params.id;
    //get info for id
    const queryString = "SELECT name, light_pol from ontario_parks WHERE id=?";
    getConnection().query(queryString, id, (err, parkInfo) => {
        if (err) {
            console.log("failed" + err)
            res.sendStatus(500)
            return
        }

        res.render('park.ejs', { parkname: parkInfo[0].name, parkid: parkInfo[0].id, parklightpol: parkInfo[0].light_pol });
        res.end();

    })
})



//note, res.send sends the HTTP response, res.end ends the response process
app.post('/results.html', (req, res) => {
    console.log("Latitude entered: " + req.body.lat)
    console.log("Longitude entered: " + req.body.lng)
    console.log("Maximum Distance: " + req.body.dist)
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
            console.log("failed" + err)
            res.sendStatus(500)
            return
        }
        //console.log(results);
        //res.send(results)
        res.render('results.ejs', { location: [lat, lng], parks: results, mapAPIKey: mapsKey1 });
        res.end()
    })

})


