# StarFinder
Setup:\
NOTE: DO NOT COMMIT ANY API KEY INFORMATION!!!\
in Visual Studio Code, run the following commands\
npm install -g nodemon\
npm install express\
npm install morgan\
npm install sql\
npm install body-parser\
npm install express-session\ 
npm install dotenv --save\

Install XAMPP, run MYSQL and APACHE\
go to: localhost/phpmyadmin\
create database (info via MESSENGER)\

We will be having the server hosted remotely for better usage, localhost phpmyadmin sucks\
see (https://www.youtube.com/watch?v=w0HAZKxyrf8&list=PL0dzCUj1L5JE4w_OctDGyZOhML6OtJSqR&index=5)\

how to setup user login from console\
create table users
(
  id           smallint(9) auto_increment
    primary key,
  name         varchar(50)                                                                       not null,
  email        varchar(70)                                                                       not null,
  dateofbirth  date                                                                              not null,
  username     varchar(25)                                                                      null,
  salt         varchar(16)                                                                       null,
  passwordhash varchar(300)                                                                      null,
  constraint users_username_uindex
    unique (username)
)

HELPFUL LINKS\
https://www.physics.mcmaster.ca/sidewalkastronomy \
https://www.youtube.com/playlist?list=PL0dzCUj1L5JE4w_OctDGyZOhML6OtJSqR \
https://www.handprint.com/ASTRO/bortle.html
