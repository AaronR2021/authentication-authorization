var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash=require('connect-flash');


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth.js');
var mongoose = require('mongoose');

var session=require('express-session')
const MongoStore = require('connect-mongo');

const urlDatabase="mongodb+srv://test:test@cluster0.rpnj4.mongodb.net/auth?retryWrites=true&w=majority";
mongoose.connect(urlDatabase,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{console.log(err?err:"database connected")});

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//session
app.use(session({
  secret:"SOMESECRET",
  resave:false,
  saveUninitalized:false,
  //store session info in database
  store: MongoStore.create({
    mongoUrl: urlDatabase
})
}))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

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