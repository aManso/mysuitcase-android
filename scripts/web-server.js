//var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);

// FILES
var connection = require("./connection.js");
var events = require('./eventsController');
var userModule = require('./modules/users.js');
var tripModule = require('./modules/trips.js');

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static( rootPath + '/app'));

//app.get('/data/event/:id', events.get);
//app.get('/data/event', events.getAll);
//app.post('/data/event/:id', events.save);
//app.get('*', function(req, res) { res.sendFile(rootPath + '/app/index.html'); });

io.on('connection', function (socket) {
    console.log("connection done");
    userModule.createUserModel();
    // user calls
    socket.on('logInUser', function(data) {
        userModule.logInUser(data, socket);
    });
    socket.on('checkEmail', function(data) {
        userModule.checkEmail(data, socket);
    });
    socket.on('checkUsername', function(username) {
        userModule.checkUsername(username, socket);
    });
    socket.on('registerUser', function(data) {
        userModule.registerUser(data, socket);
    });

    // trips calls
//    userModule.createCityModel();
//    socket.on('loadCityDefaultOptions', function(city) {
//        console.log(city);
//        tripModule.getCityDefOptions(city);
//    });
});

connection.executeServerConnection(server)
connection.executeDDBBConnection();

