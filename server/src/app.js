var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var authRouter = require('./routes/authentication');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.status(200).send();
});

app.use('/authentication', authRouter);
app.use('/user', userRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err)
  res.status(err.status || 500).send();
});

module.exports = app;
