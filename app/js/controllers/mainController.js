/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('mainCtrl', function mainCtrl($scope, $location, $log, cookieService, commonFunctionsService){
    $log.info('starting mainCtrl');
    var socket = io.connect("http://localhost:8000");
    $scope.login = {};
    $scope.register = {};
    $scope.toggleRemindInput = false;
    var user = cookieService.getCookie('user');

//    login/logout *******************************************************************************************
    $scope.isLogIn = function(){
        return user != undefined ;
    }

    if($scope.isLogIn()){
        $scope.username = user.name
    }

    $scope.logOut = function(){
        user = undefined;
        cookieService.removeCookie('user');
        goToTop();
    }
    $scope.logIn = function(loginForm){
        if(loginForm.$valid){
            socket.emit('checkuser',{name:loginForm.username.$viewValue,pass:loginForm.userPassword.$viewValue});
            socket.on('userLogged', function(userDB) {
                if(userDB!=undefined){
                    $log.info('Bienvenido '+userDB.name);
                    user = userDB;
                    $scope.username = userDB.name;
                    cleanLogInFields();
                    cookieService.setCookie('user',{'login': true, id:userDB.id, name:userDB.name});
                    $scope.login.wrongUserPass = false;
                    goToTop();
                }else{
                    console.log('El usuario no existe '+userDB);
                    $scope.login.wrongUserPass = true;
                }
                $scope.$apply();
            });
        }
        $scope.remindPassError = false;
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

    $scope.register = function(registrationForm){
        if(registrationForm.$valid){
            $log.info("valid form");
        }
    }

    $scope.isValidPass = function(password){
        if(password){
            return commonFunctionsService.isValidPass(password);
        }
    }

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

});