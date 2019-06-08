//this is the entry point (app.js)

//bring in both express and mysql
const express = require('express');
const mysql = require("mysql");
const morgan = require('morgan');
const bodyParser = require('body-parser');

//set up simple express server
const app = express();

//arbitrary port 3000
app.listen('3000', ()=>{
    console.log('Server started on port 3000');
});

//tidy connection code
function getConnection(){
    return mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database : 'parks'
    });
}


//middleware, this code is looking at the request for you, 
//useful for getting data passed into the form 
app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('short'));



//serve public form to browser
//application server (express) is serving all the files in the directory
app.use(express.static('./public'))

app.post('/find_nearby_parks',(req,res)=>{
    console.log("Latitude entered: "+req.body.lat)
    console.log("Longitude entered: "+req.body.lng)
    console.log("Maximum Distance: "+ req.body.dist)
    //get fields from forms
    const lat = req.body.lat;
    const lng = req.body.lng;
    const dist = req.body.dist;
    const lightpol = req.body.lightpol;

    //6371 is km, 3959 is miles 
    const queryString = "SELECT *, ( 6371 * acos( cos( radians( ? ) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( lat ) ) ) ) AS distance FROM ontario_parks HAVING distance <= ? AND light_pol <= ? ORDER BY distance ASC";
    getConnection().query(queryString, [lat, lng, lat, dist, lightpol], (err, results)=>{
        if(err){
            console.log("failed"+err)
            res.sendStatus(500)
            return
        }
        console.log(results);
        res.send(results);
        res.end()
    })

})



