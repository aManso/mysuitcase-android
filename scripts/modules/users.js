var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bbdd = undefined
//  Ojo!!!! si queremos usar una unica conexion o bbdd podemos directamente llamar mongoose.model pues si previamente ya hemos hecho la conexion mongoose solo tendra una,
//  pero si queremos utilizar varias conexiones o bbdd deberemos guardar en un objeto la conexion y usarla para cada modelo, para asi saber a que bbdd debemos guardar cada collection.
var connectionModule = require('../connection.js');
var UserModel = undefined;

userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email       :  {
        type: String,
        match: /.+@.+\..+/,
        required: true,
        lowercase : true
    },
    password    :   {
        type: String,
        required: true
    }
});

module.exports.createUserModel = function(){
    if(UserModel===undefined){
        bbdd = connectionModule.getDDBB()
        UserModel = bbdd.model('user', userSchema, 'users');
    }
}

module.exports.getUserModel = function(){
    return UserModel;
}

module.exports.registerUser = function (data, socket) {
    console.log(data);
    var newUser = new UserModel({
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
        socket.emit('registerUserCallback', saved);
    });
}

module.exports.logInUser = function (data, socket) {
    if(data.fromFB){
        console.log('logInUser with FB');
    }else{
        console.log('logInUser: ' + data.name);
        UserModel.find({name: data.name, password: data.password}, function (err, user) {
            console.log("the user logged is  " + user);
            if (err) throw err;
            socket.emit('logInUserBack', user[0]);
        });
    }
}

module.exports.checkEmail = function (data, socket) {

    console.log('checkEmail: ' + data);
    UserModel.find({email:data.email},function(err, user){
        console.log("the email already exists "+user);
        if(err) throw err;
        socket.emit('checkEmailBack', user[0]!=undefined);
    });
}

module.exports.checkUsername = function (username, socket) {
    console.log(username+"*******************");
    if(username!= undefined){
        username = username.toLowerCase();
        UserModel.aggregate([
            {$project: {name: { $toLower: "$name" }}},
            {$match:{name:username}}
        ], function(err, user){
            console.log(user);
            var validUser = user!=undefined && user.length>0 && user[0]!=undefined
            socket.emit('checkUsernameCallback', validUser);
        });

    }else{
        socket.emit('checkUsernameCallback', false);
    }
}



