var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var err = require('./routes/error');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socket = require('./routes/app-socket');
socket(io);

// io.sockets.on('connection', socket);

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));	
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use(err.not_found);
app.use(err.error);





server.listen(9000, function (argument) {
	console.log("server is listening at port " + 9000);
});
module.exports = app;
