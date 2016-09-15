var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bbdd = undefined
//  Ojo!!!! si queremos usar una unica conexion o bbdd podemos directamente llamar mongoose.model pues si previamente ya hemos hecho la conexion mongoose solo tendra una,
//  pero si queremos utilizar varias conexiones o bbdd deberemos guardar en un objeto la conexion y usarla para cada modelo, para asi saber a que bbdd debemos guardar cada collection.
var connectionModule = require('../connection.js');
var UserModel = undefined;
var Socket = undefined;

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
        required: false
    },
    gender    :   {
        type: String,
        required: false
    },
    isFB    :   {
        type: Boolean,
        required: false
    },
    picture    :   {
        type: String,
        required: false
    }
});

module.exports.createUserModel = function(){
    if(UserModel===undefined){
        bbdd = connectionModule.getDDBB()
        UserModel = bbdd.model('user', userSchema, 'users');
    }
    Socket = connectionModule.getSocket();
    console.log("socket set in user module");
}

module.exports.getUserModel = function(){
    return UserModel;
}

module.exports.registerUser = function (data) {
    console.log("Registering new user with data: "+JSON.stringify(data));
    var newUser = new UserModel({
        name: data.name,
        email: data.email,
        gender:data.gender,
        password: data.password,
        isFB: data.isFB,
        picture: data.picture
    });
    newUser.save(function(err, user){
        if(err){
            console.log("User not saved "+user);
            throw err;
        }else{
            Socket.emit('registerUserCallback', saved);
            console.log("User saved "+user);
        }
    });
}

module.exports.logInUser = function (data) {
    console.log('logInUser: ' + data.name);
    UserModel.find({name: data.name, password: data.password}, function (err, user) {
        console.log("the user logged is  " + user);
        if (err) throw err;
        Socket.emit('logInUserBack', user[0]);
    });
}

module.exports.checkEmail = function (data) {
    console.log('checkEmail: ' + data.email);
    UserModel.find({email:data.email},function(err, user){
        if(err) throw err;
        Socket.emit('checkEmailBack', user[0]!=undefined);
    });
}

module.exports.checkUsername = function (username) {
    console.log("checking username "+username+"*******************");
    if(username!= undefined){
        username = username.toLowerCase();
        UserModel.aggregate([
            {$project: {name: { $toLower: "$name" }}},
            {$match:{name:username}}
        ], function(err, user){
            var validUser = user!=undefined && user.length>0 && user[0]!=undefined
            Socket.emit('checkUsernameCallback', validUser);
        });

    }else{
        Socket.emit('checkUsernameCallback', false);
    }
}





