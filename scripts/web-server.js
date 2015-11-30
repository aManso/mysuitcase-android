var express = require('express');
var path = require('path');
var events = require('./eventsController');
var http = require('http');
var fs = require('fs');
var app = express();
var mongoose = require('mongoose');
var rootPath = path.normalize(__dirname + '/../');
var bodyParser = require('body-parser');

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
    socket.on('logInUser', function(data) {
       console.log('logInUser: ' + data);
       User.find({name:data.name, password:data.password},function(err, user){
            console.log("the user logged is  "+user);
            if(err) throw err;
            socket.emit('logInUserBack', user[0]);
       });
    });
    socket.on('checkEmail', function(data) {
        console.log('checkEmail: ' + data);
        User.find({email:data.email},function(err, user){
            console.log("the email already exists "+user);
            if(err) throw err;
            socket.emit('checkEmailBack', user[0]!=undefined);
        });
    });

    socket.on('checkUsername', function(username) {

        if(username!= undefined){
            username = username.toLowerCase();
            User.aggregate([
                {$project: {name: { $toLower: "$name" }}},
                {$match:{name:username}}
            ], function(err, user){
                socket.emit('checkUsernameBack', user[0]!=undefined);
            });
        }else{
            socket.emit('checkUsernameBack', false);
        }
    });
    socket.on('registerUser', function(data) {
        console.log(data);
        var newUser = new User({
            name:data.name,
            email:data.email,
            password:data.password
        });
        newUser.save(function(err, user){
            var saved = false;
            if(err){
                console.log("User not saved "+user);
                socket.emit('registerUserBack', false);
                throw err;
            }else{
                saved = true;
                console.log("User saved "+user);
            }
            socket.emit('registerUserBack', saved);
        });
    });
});
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    console.log('connected with ddbb');
});
mongoose.connect('mongodb://alex:Mdeveloper-3@ds051833.mongolab.com:51833/mysuitcase');

var Schema = require('mongoose').Schema;

var User = new Schema({
    name        :   String,
    email   :   String,
    password        :   String
});
User = db.model('User', User);

server.listen(8000);
console.log('Listening on port ' + 8000 + '...');