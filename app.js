var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//ajouter import bar

const mongoose = require('mongoose');
// mongoose.connect(process.env.DATABASE_URL || 'mongodb+srv://admin:<archioweb>@projet-archioweb.8sakj.mongodb.net/projet-archioweb?retryWrites=true&w=majority');

var app = express();

app.use(function myMiddleware(req, res, next) {
  console.log('Hello World!');
  next();
});

app.use(function(req, res, next) {
  req.hello = 'World';
  next();
});

app.use(function(req, res, next) {
  console.log('Hello ' + req.hello); // "Hello World"
  next();
});

app.get('/hello', function() {
  res.send('World');
});

function getNameFromQuery(req, res, next) {
  req.nameToSalute = req.query.name;
  next();
}

function prepareSalutation(req, res, next) {
  req.salutation = 'Hello ' + req.nameToSalute;
  next();
}

app.get('/hello', getNameFromQuery, prepareSalutation, function(req, res, next) {
  res.send(req.salutation);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if(process.env.NODE_ENV !== 'test'){
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/)

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
