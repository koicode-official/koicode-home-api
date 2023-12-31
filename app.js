var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');

var app = express();

const allowedOrigins = [ "http://localhost:3001","http://localhost:3000" , "http://ec2-43-201-220-178.ap-northeast-2.compute.amazonaws.com" ,"https://www.koicode.co.kr" , "https://koicode.co.kr"]

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//cors

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    console.log('request orign', origin)
    console.log('include ', allowedOrigins.indexOf(origin))
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
        console.log('msg', msg)
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
  // origin: function (origin, callback) {
  //   // allow requests with no origin 
  //   // (like mobile apps or curl requests)
  //   if (!origin) return callback(null, true);
  //   if (allowedOrigins.indexOf(origin) === -1) {
  //     var msg = 'The CORS policy for this site does not ' +
  //       'allow access from the specified Origin.';
  //     return callback(new Error(msg), false);
  //   }
  //   return callback(null, true);
  // }
}));



app.use('/api', indexRouter);

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
