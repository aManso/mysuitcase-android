/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('mainCtrl', function mainCtrl($scope, $location, $log, cookieService){
    $log.info('starting mainCtrl');

    $scope.isLogIn = function(){
        return cookieService.getCookie('user') != undefined ;
    }
    $scope.logOut = function(){
        cookieService.setCookie('user',{'login': false});
    }
    $scope.logIn = function(){
        cookieService.setCookie('user',{'login': true});
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