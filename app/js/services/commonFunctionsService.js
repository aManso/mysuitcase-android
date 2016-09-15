/** * Created by Alex on 25/11/2015. */

var commonFunctionsService = angular.module('commonFunctionsService', []);
suitcaseApp.service('commonFunctionsService', function($location, $q){
    var socket = io.connect("http://localhost:8000");
    var PATHS = {
        makeSuitcase : '/makeSuitcase',
        chooseOptions : '/chooseOptions'
    };
    var user = undefined;

    this.isValidPass = function(password){
        var numPattern = new RegExp('[0-9]');
        var simbPattern = /\W/;
        return password.length>=3 && numPattern.test(password) && simbPattern.test(password);
    }

    this.goTo = function(path){
        $location.path(PATHS[path])
    }

    // #################### log in ###################################

    this.logIn = function(user) {
        socket.emit('logInUser', user);
        var deferred = $q.defer();
        socket.on('logInUserBack', function(userDB) {
            deferred.resolve(userDB);
        });
        return deferred.promise;
    }

    this.goToTop = function(){
        $('.navbar-brand')[0].click();
    }

    this.isLogIn = function(){
        return user != undefined ;
    }

    this.setLogInUser = function(userLogged){
        return user = userLogged ;
    }

    // #################### checks ###################################

    this.checkExistingUsername = function(email){
        var deferred = $q.defer();
        email = email.toLowerCase();
        socket.emit('checkUsername',{email:email});
        socket.on('checkUsernameCallback', function(exists) {
            deferred.resolve(exists);
            return exists;
        });
        return deferred.promise;
    }

    this.checkExistingEmail = function(email){
        var deferred = $q.defer();
        email = email.toLowerCase();
        socket.emit('checkEmail',{email:email});
        socket.on('checkEmailBack', function(exists) {
            deferred.resolve(exists);
            return exists;
        });
        return deferred.promise;
    }
});