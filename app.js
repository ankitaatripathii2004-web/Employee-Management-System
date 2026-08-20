// Load environment variables
require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var session= require('express-session');
var passport= require('passport');
var flash= require('connect-flash');
var MongoStore= require('connect-mongo');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var employee = require('./routes/employee');
var manager = require('./routes/manager');

expressValidator = require('express-validator');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
var mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/HRMS";

if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

var db = mongoose.connection;

db.on("error", () => {
    console.log("MongoDB connection failed...");
});
db.once("open", () => {
    console.log("MongoDB connection successful...");
});
require('./config/passport.js');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysupersecret', 
  resave: false, 
  saveUninitialized: false, 
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/HRMS"
  }),
  cookie:{maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 180*60*1000},
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  if (req.user) {
    req.session.user = req.user;
  }
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.user = req.user;
  res.locals.messages = req.flash();
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/manager', manager);
app.use('/employee', employee);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (err.code === 'EBADCSRFTOKEN') {
    if (req.flash) {
      req.flash('error', 'Session expired. Please try logging in again.');
    }
    return res.redirect('/');
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
