var express = require('express');
var path = require('path');
var events = require('./eventsController');
var http = require('http');
var fs = require('fs');
var app = express();
var mongoose = require('mongoose');
var rootPath = path.normalize(__dirname + '/../');
var bodyParser = require('body-parser');
var userModule = require('./modules/users.js');
var tripModule = require('./modules/trips.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static( rootPath + '/app'));

//app.get('/data/event/:id', events.get);
//app.get('/data/event', events.getAll);
//app.post('/data/event/:id', events.save);
//app.get('*', function(req, res) { res.sendFile(rootPath + '/app/index.html'); });



var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log("connection done");

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
    socket.on('loadCityDefaultOptions', function() {
        tripModule.getCityDefOptions(socket);
    });


});
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    console.log('connected with ddbb');
});
mongoose.connect('mongodb://alex:Mdeveloper-3@ds051833.mongolab.com:51833/mysuitcase');

userModule.createUserModel(db);

server.listen(8000);
console.log('Listening on port ' + 8000 + '...');