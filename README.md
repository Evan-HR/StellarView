# StarFinder
**⚠️⚠️⚠️!!!NOTE: DO NOT COMMIT ANY API KEY INFORMATION!!!⚠️⚠️⚠️**

## On Ports
Backend node server can be connected to via `http://localhost:5000/`\
Frontend react server can be connected to via `http://localhost:3000/`

## Database Setup

Install XAMPP, run MYSQL and APACHE\
Go to: localhost/phpmyadmin\
Create database:
```
CREATE TABLE `ontario_parks` (
 `id` int(25) NOT NULL AUTO_INCREMENT,
 `osm_id` int(25) NOT NULL,
 `name` varchar(25) NOT NULL,
 `name_alt` text NOT NULL,
 `light_pol` decimal(10,8) NOT NULL,
 `lat` decimal(11,8) NOT NULL,
 `lng` decimal(11,8) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12488 DEFAULT CHARSET=utf8
```
```
CREATE TABLE users (
 id smallint(9) NOT NULL AUTO_INCREMENT,
 email varchar(70) NOT NULL,
 name varchar(50) DEFAULT NULL,
 password varchar(300) NOT NULL,
 PRIMARY KEY (id),
 UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8
```
```
CREATE TABLE `reviews` (
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
```

## Server Development Mode

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

## HOW TO AVOID PROP DRILLING
use Contexts!\
const UserContext = React.createContext()\
this returns both a provider and a consumer, properties of UserContext\
to set up provider:
```
render(){
return(
<UserContext.Provider value = {this.state.user}>
<Main />
</UserContext.Provider>
```
Now suppose a NavBar() function/component is in main
```
function NavBar(){
return(
 <UserContext.Consumer>
 ##HTML GOES HERE##
  </UserContext.Consumer>
)
}
```
You'll get a "render not a function" ,so that's why you use arrow function!

```
function NavBar(){
return(
	<UserContext.Consumer>
	{value => <nav>
	<span> Hello, {value}!</span>
		</nav>
	}
  </UserContext.Consumer>
);
}
```
But, this is kinda #gross no?\
solution: useContext hooks!\
what is a hook? - let you use state without writing a class

```
import React, {useContext} from 'react':
```

Then, you can keep your provider wrapper, but you don't need the consumer wrapper
```
function Navbar() {
  const { firstName, lastName } = useContext(UserContext);

  return (
    <nav>
      <span className="title">Cool App</span>

      <span>
        Hello, {firstName} {lastName}!
      </span>
    </nav>
  );
}
```

full code:\
https://codesandbox.io/s/5zv4xm1pyk


## SESSION INFO
```
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));
```
install `npm install passport-local` because i used a local\
strategy database, this might need to be diff on server-side

