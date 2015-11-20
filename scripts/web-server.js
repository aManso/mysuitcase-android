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
    socket.on('checkuser', function(data) {
        console.log('checkuser: ' + data);
        mongoose.model('users').find({name:data.name, password:data.pass},function(err, user){
            console.log(user);
            if(err) throw err;
            socket.emit('userLogged', user[0]);
        });
    });
});
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    console.log('connected with ddbb');
});
mongoose.connect('mongodb://alex:Mdeveloper-3@ds051833.mongolab.com:51833/mysuitcase');
mongoose.model('users',{asda:String});

server.listen(8000);
console.log('Listening on port ' + 8000 + '...');