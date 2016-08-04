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

module.exports.getCityDefOptions = function (city) {
    console.log('getting city default options: ');
    City.find({name: city}, function (err, result) {
        console.log("the user logged is  " + result);
        if (err) throw err;
        socket.emit('defCityOptBack', result[0]);
    });
}