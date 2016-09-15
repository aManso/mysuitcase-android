'use strict';
suitcaseApp.controller('mainCtrl', function mainCtrl($scope, $location, $log, storageService, commonFunctionsService){
    $log.info('starting mainCtrl');
    var socket = io.connect("http://localhost:8000");
    $scope.toggleRemindInput = false;
    $scope.user = storageService.getInfoLS('user');
    var regExpEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    $scope.remindUser = {
        email : undefined
    }
    $scope.forms = {
        registerUserForm : {}
    }

//    remindPass *******************************************************************************************
    $scope.toggleRemind = function() {
        $scope.remindPassError = undefined;
        return $scope.toggleRemindInput =! $scope.toggleRemindInput;

    }

    $scope.checkRemindEmail = function(remindPassEmail){
        if(!regExpEmail.test($scope.remindUser.email)){
            $scope.remindPassError = {invalid : true};
        }else{
            socket.emit('checkEmail',{email:$scope.remindPassEmail});
            socket.on('userEmail', function(userDB) {
                if (!userDB) {
                    $scope.remindPassError = {unregistered : true};
                }else{
                    $scope.remindPassError = {};
                }
            });
        }
    }

    $scope.remindPass = function(){
        if($scope.remindPassEmail){
            socket.emit('checkEmail',{email:$scope.remindPassEmail});
            socket.on('userEmail', function(userDB) {
                if (!userDB) {
                    $scope.remindPassError = {unregistered : true};
                }
            });
        }else{
            $scope.remindPassError = undefined;
            if ($scope.forms.loginUserForm){
                $scope.forms.loginUserForm.userPassword.$touched = false;
                $scope.forms.loginUserForm.username.$touched = false;
            }
        }
    }

    //    register area *******************************************************************************************
    $scope.register = {};
    $scope.register.register = function(){
        $log.info("valid form");
        var user = {
            name: $scope.register.username,
            email: $scope.register.email,
            password: $scope.register.password
        }
        socket.emit('registerUser',user);
        socket.on('registerUserCallback', function(userDB) {
            if (userDB) {
                console.log('The user has been registered successfully');
                commonFunctionsService.logIn({name:$scope.register.username, password:$scope.register.password});
                cleanRegisterForm();
                commonFunctionsService.goToTop();
            }else{
                console.log('There has been an error when registering the user');
            }
        });
    }

    $scope.register.isValidUser = function(){
        return $scope.register.username!==undefined && $scope.isLongEnoughField($scope.register.username,2) && !$scope.register.usernameExists;
    }

    $scope.isLongEnoughField = function(field, long){
        return field!=undefined && field.length>long;
    }

    $scope.register.checkExistingUsername = function(){
        if($scope.register.username){
            commonFunctionsService.checkExistingUsername($scope.register.username).then(function(exists){
                $scope.register.usernameExists = exists;
            });
        }
    }

    $scope.register.checkExistingEmail = function(email){
        var a = $scope.register.email;
        if(email.$viewValue){
            commonFunctionsService.checkExistingEmail(email.$viewValue).then(function(exists){
                $scope.register.emailExists = exists;
            });
        }
    }

    $scope.register.isValidPass = function(){
        if($scope.register.password){
            return commonFunctionsService.isValidPass($scope.register.password);
        }
    }

    $scope.register.isValidForm = function(registrationForm){
        return $scope.register.isValidUser() && !$scope.register.checkExistingUsername(registrationForm.registerUserEmail) &&
         registrationForm.registerUserEmail.$valid && !$scope.register.emailExists &&
         $scope.register.isValidPass() && $scope.register.password === $scope.register.repeatPassword && registrationForm.$valid;
    }

    function cleanRegisterForm(){
        $scope.register = {
            username : undefined,
            email : undefined,
            password : undefined,
            repeatPassword : undefined
        };
        $scope.register.emailExists = false;
        $scope.register.usernameExists = false;
        $scope.forms.registerUserForm.registerUserName.$touched = false;
        $scope.forms.registerUserForm.registerUserEmail.$touched = false;
        $scope.forms.registerUserForm.userPassword.$touched = false;
        $scope.forms.registerUserForm.repeatUserPassword.$touched = false;
    }

    //   Log in area   ****************************************************************************************
    $scope.isLogIn = function(){
        return commonFunctionsService.isLogIn();
    }

    $scope.logInUser = function(loginForm) {
        if (loginForm && loginForm.$valid) {
            commonFunctionsService.logIn({name: loginForm.username.$viewValue, password: loginForm.userPassword.$viewValue}).then(function(loggedUser){
                if(loggedUser!=undefined){
                    $log.info('Bienvenido '+loggedUser.name);
                    $scope.user = userDB;
                    cleanLogInFields();
                    storageService.setInfoLS('user',{'login': true, id:loggedUser.id, name:loggedUser.name});
                    $scope.login.wrongUserPass = false;
                    commonFunctionsService.setLogInUser({name: loginForm.username.$viewValue, password: loginForm.userPassword.$viewValue});
                    commonFunctionsService.goToTop();
                }else{
                    $log.info('El usuario no existe '+loggedUser);
                    $scope.login.wrongUserPass = true;
                }
            });
        }
        $scope.remindPassError = false;
    };

    function cleanLogInFields(){
        $scope.login.username = undefined;
        $scope.login.userPassword = undefined;
        $scope.forms.loginUserForm = {};
    }

    $scope.viewVal = function(){
        if($scope.login.username!=undefined){
            $log.info($scope.login.username);
        }
    }
});