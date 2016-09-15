var mongoose = require('mongoose');
var db = undefined;
var Socket = undefined;

module.exports.executeDDBBConnection = function(){
    console.log("connecting");
    db = mongoose.createConnection('mongodb://alex:Mdeveloper-3@ds051833.mongolab.com:51833/mysuitcase', {
        'auto_reconnect': true,
        'poolSize': 5}
    );

    db.on('error', console.error);
    db.once('open', function() {
        console.log('connected with ddbb');
    });
}

module.exports.getDDBB = function(){
    return db;
}

module.exports.executeServerConnection = function(server){
    server.listen(8000);
    console.log('Listening on port ' + 8000 + '...');
}

module.exports.setSocket = function(socket){
    Socket = socket;
}
module.exports.getSocket = function(){
    return Socket;
}
