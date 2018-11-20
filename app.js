var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var i18n = require('i18n');

i18n.configure({

//define how many languages we would support in our application
locales:['en', 'zh'],

//define the path to language json files, default is /locales
directory: __dirname + '/locales',

//define the default language
defaultLocale: 'en',

// define a custom cookie name to parse locale settings from 
cookie: 'i18n'
});

app.use(cookieParser("i18n_demo"));
app.use(session({
  secret: "i18n_demo",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(i18n.init);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', function (req, res) {
  //res.setLocale(req.cookies.i18n);
  res.render('main', {
  i18n: res
  })
});

app.get('/contact', function (req, res) {
  res.render('contact', {
  i18n: res
  })
});

app.get('/zh', function (req, res) {
  res.cookie('i18n', 'zh');
  res.redirect('/')
});

app.get('/en', function (req, res) {
  res.cookie('i18n', 'en');
  res.redirect('/')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
