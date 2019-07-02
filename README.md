# StarFinder
**⚠️⚠️⚠️!!!NOTE: DO NOT COMMIT ANY API KEY INFORMATION!!!⚠️⚠️⚠️**

## On Ports
Backend node server can be connected to via `http://localhost:5000/`\
Frontend react server can be connected to via `http://localhost:3000/`

## Traditional Setup
in Visual Studio Code, run the following commands
```
npm install -g nodemon
npm install express
npm install morgan
npm install sql
npm install body-parser
npm install express-session 
npm install dotenv --save
```

Install XAMPP, run MYSQL and APACHE\
go to: localhost/phpmyadmin\
create database (info via MESSENGER)\

## reactPlayground Development Mode

First time:
```
npm run setup
```

To run react/node server in development mode:
```
npm run dev
```

We will be having the server hosted remotely for better usage, localhost phpmyadmin sucks\
see (https://www.youtube.com/watch?v=w0HAZKxyrf8&list=PL0dzCUj1L5JE4w_OctDGyZOhML6OtJSqR&index=5)\



## HELPFUL LINKS
https://www.physics.mcmaster.ca/sidewalkastronomy \
https://www.youtube.com/playlist?list=PL0dzCUj1L5JE4w_OctDGyZOhML6OtJSqR \
https://www.handprint.com/ASTRO/bortle.html

Light pollution data via: https://ngdc.noaa.gov/eog/viirs/download_dnb_composites.html\

## SESSION INFO
```
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));
```
install `npm install passport-local` because i used a local\
strategy database, this might need to be diff on server-side\

reviews query: CREATE TABLE `reviews` (
 `id` int(25) unsigned NOT NULL AUTO_INCREMENT,
 `p_id` int(25) NOT NULL,
 `score` smallint(5) unsigned NOT NULL,
 `name` varchar(20) DEFAULT NULL,
 `user_id` int(25) unsigned NOT NULL,
 `review` varchar(2000) DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `fk_reviews` (`p_id`),
 CONSTRAINT `fk_reviews` FOREIGN KEY (`p_id`) REFERENCES `ontario_parks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8
