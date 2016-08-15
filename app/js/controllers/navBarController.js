'use strict';
suitcaseApp.controller('navBarCtrl', function navBarCtrl($scope, $log, $location) {
    $log.info('starting navBarCtrl');

    var socket = io.connect("http://localhost:8000");
    $scope.login = {};

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

    $scope.goAdminArea = function(){
        $location.path("/adminarea");
    }
});