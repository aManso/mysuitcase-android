/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('mainCtrl', function mainCtrl($scope, $location, $log, cookieService){
    $log.info('starting mainCtrl');
    var user = cookieService.getCookie('user');

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
    $scope.logIn = function(logginForm){
        user = {
            name : logginForm.username.$viewValue,
            id : '0001'
            }
        $scope.username = user.name;
        cleanLogInFields();
        cookieService.setCookie('user',{'login': true, id:user.id, name:user.name});
        goToTop();
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
    function cleanLogInFields(){
        $scope.username = undefined;
        $scope.userPassword = undefined;
    }
});