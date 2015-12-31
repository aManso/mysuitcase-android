/**
 * Created by alejandromansogonzalez on 31/12/15.
 */
var Schema = require('mongoose').Schema;
var City = undefined;

module.exports.createCityModel = function(db){
    City = new Schema({
        name        :   String,
        country   :   String,
        basic_items: [],
        optional_items: [],
        summer_items: [],
        winter_items: []
    });
    City = db.model('City', City);
}

module.exports.getCityDefOptions = function (socket) {
    console.log('getting city default options: ');
    City.find({name: defaultOptions}, function (err, user) {
        console.log("the user logged is  " + user);
        if (err) throw err;
        socket.emit('logInUserBack', user[0]);
    });
}