var Schema = require('mongoose').Schema;
var User = undefined;

module.exports.createUserModel = function(db){
    User = new Schema({
        name        :   String,
        email   :   String,
        password        :   String
    });
    User = db.model('User', User);
}

module.exports.logInUser = function (data, socket) {
    console.log('logInUser: ' + data);
    User.find({name: data.name, password: data.password}, function (err, user) {
        console.log("the user logged is  " + user);
        if (err) throw err;
        socket.emit('logInUserBack', user[0]);
    });
}

module.exports.checkEmail = function (data, socket) {

    console.log('checkEmail: ' + data);
    User.find({email:data.email},function(err, user){
        console.log("the email already exists "+user);
        if(err) throw err;
        socket.emit('checkEmailBack', user[0]!=undefined);
    });
}

module.exports.checkUsername = function (username, socket) {
    if(username!= undefined){
        username = username.toLowerCase();
        User.aggregate([
            {$project: {name: { $toLower: "$name" }}},
            {$match:{name:username}}
        ], function(err, user){
            socket.emit('checkUsernameBack', (user.length>0 && user[0]!=undefined));
        });
    }else{
        socket.emit('checkUsernameBack', false);
    }
}

module.exports.checkUsername = function (data, socket) {
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
}

