'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var mongoose = require("mongoose");
var flash = require("connect-flash");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var passport = require("passport");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Brewery = require("./models/brewery");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var url = process.env.DATABASEURL || "mongodb://localhost:27017/brewries";
mongoose.connect(url);
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected!')
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error');
});

//requiring routes
var commentRoutes = require("./routes/comments"),
    breweryRoutes = require("./routes/breweries"),
    indexRoutes = require("./routes/index");

// view engine setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

seedDB(); //Seed the database with the files from seeds.js

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "add your own secret here",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Basic Error Handling
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Routing
app.use("/", indexRoutes);
app.use("/breweries", breweryRoutes);
app.use("/breweries/:id/comments", commentRoutes);



app.set('port', process.env.PORT || 3000);

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("The Breweries Server Has Started!");
});
