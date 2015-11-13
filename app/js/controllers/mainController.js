/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('mainCtrl', function mainCtrl($scope, $location, $log){
    $log.info('starting mainCtrl');
    var logged = false;

    $scope.isLogIn = function(){
        logged;
    }
    $scope.logOut = function(){
        logged = false;
    }
    $scope.logIn = function(){
        logged = true;
    }
    $scope.goBackHome = function(){
        $location.path("/chooseOptions");
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
});