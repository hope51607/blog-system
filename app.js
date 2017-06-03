var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var engine = require('ejs-mate');
var helpers = require('express-helpers'); //ejs link_to 要用


var index = require('./routes/index');		//設定路由
var users = require('./routes/users');
var apis = require('./routes/apis');

var app = express();   //ejs link_to 要用

helpers(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',engine);
app.set('view engine', 'ejs');   //jade

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//啟用cookie session
app.use(cookieSession({
	key: 'node',
	secret: 'HelloExpressSESSION'
}));

app.use('/', index);						//將指定/的網址都交給index處理 下面同理
app.use('/users', users);
app.use('/apis', apis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
