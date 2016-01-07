/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('mainCtrl', function mainCtrl($scope, $location, $log, storageService, commonFunctionsService){
    $log.info('starting mainCtrl');
    var socket = io.connect("http://localhost:8000");
    $scope.login = {};

    $scope.toggleRemindInput = false;
    $scope.user = storageService.getInfoLS('user');

//    login/logout *******************************************************************************************
    $scope.isLogIn = function(){
        return $scope.user != undefined ;
    }

    $scope.logOut = function(){
        $scope.user = undefined;
        storageService.removeInfoLS('user');
        goToTop();
    }
    $scope.logInUser = function(loginForm) {
        if (loginForm && loginForm.$valid) {
            logIn({name: loginForm.username.$viewValue, password: loginForm.userPassword.$viewValue});
        }
        $scope.remindPassError = false;
    };

    function logIn(user){
        socket.emit('logInUser',user);
        socket.on('logInUserBack', function(userDB) {
            if(userDB!=undefined){
                $log.info('Bienvenido '+userDB.name);
                $scope.user = userDB;
                cleanLogInFields();
                storageService.setInfoLS('user',{'login': true, id:userDB.id, name:userDB.name});
                $scope.login.wrongUserPass = false;
                goToTop();
            }else{
                console.log('El usuario no existe '+userDB);
                $scope.login.wrongUserPass = true;
            }
            $scope.$apply();
        });
    }

    function cleanLogInFields(){
        $scope.login.username = undefined;
        $scope.login.userPassword = undefined;
    }

//    remindPass *******************************************************************************************
    $scope.toggleRemind = function() {
        $scope.remindPassError=false;
        return $scope.toggleRemindInput=!$scope.toggleRemindInput;

    }

    $scope.remindPass = function(){
        if($scope.remindPassEmail){
            socket.emit('checkEmail',{email:$scope.remindPassEmail});
            socket.on('userEmail', function(userDB) {
                if (!userDB) {
                    $scope.remindPassError = true;
                }
            });
        }else{
            $scope.remindPassError = true;
            if ($scope.loginForm){
                $scope.loginForm.userPassword.$touched = false;
                $scope.loginForm.username.$touched = false;
            }
        }
    }

    //    register area *******************************************************************************************
    $scope.register = {};
    $scope.register.register = function(registrationForm){
        $log.info("valid form");
        var user = {
            name: $scope.register.username,
            email: $scope.register.email,
            password: $scope.register.password
        }
        socket.emit('registerUser',user);
        socket.on('registerUserBack', function(userDB) {
            if (userDB) {
                console.log('The user has been registered successfully');
                logIn({name:$scope.register.username, password:$scope.register.password});
                cleanRegisterForm(registrationForm);
                goToTop();
            }else{
                console.log('There has been an error when registering the user');
            }
        });
    }

    $scope.register.isValidUser = function(){
        if($scope.register.username){
            return $scope.register.username.length>2;
        }
    }

    $scope.register.checkExistingUsername = function(){
        socket.emit('checkUsername',$scope.register.username);
        socket.on('checkUsernameBack', function(userDB) {
            $scope.register.usernameExists = userDB;
        });
    }

    $scope.register.checkExistingEmail = function(){
        checkExistingEmail($scope.register.email, 'register');
    }

    $scope.register.isValidPass = function(){
        if($scope.register.password){
            return commonFunctionsService.isValidPass($scope.register.password);
        }
    }

    $scope.register.isValidForm = function(registrationForm){
        return $scope.register.isValidUser() && !$scope.register.checkExistingUsername() &&
         registrationForm.userEmail.$valid && !$scope.register.emailExists &&
         $scope.register.isValidPass() && $scope.register.password === $scope.register.repeatPassword &&
            registrationForm.$valid;

    }

    function cleanRegisterForm(registrationForm){
        $scope.register = {
            username : undefined,
            email : undefined,
            password : undefined,
            repeatPassword : undefined
        };
        $scope.register.emailExists = false;
        $scope.register.usernameExists = false;
        registrationForm.registerUserName.$touched = false;
        registrationForm.userEmail.$touched = false;
        registrationForm.userPassword.$touched = false;
        registrationForm.repeatUserPassword.$touched = false;
    }

//****************************************************************************************

    $scope.goAdminArea = function(){
        $location.path("/adminarea");
    }
    switch ($location.path()){
        case "/chooseOptions" :
            $scope.topButton = "Hacer maleta";
            break;
        case "/adminarea" :
            topButton : "Admin area";
            break;
        default: $scope.topButton = "Hacer maleta";
    }
    function goToTop(){
        $('.navbar-brand')[0].click();
    }

    function checkExistingEmail(email, target){
        if(email){
            email = email.toLowerCase();
            socket.emit('checkEmail',{email:email});
            socket.on('checkEmailBack', function(exists) {
                switch(target){
                    case 'register': $scope.register.emailExists = exists;
                    case 'login': $scope.login.email = exists;
                }
                $scope.$apply();
            });
        }
    }
});