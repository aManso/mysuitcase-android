/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('mainCtrl', function mainCtrl($scope, $location, $log, cookieService){
    $log.info('starting mainCtrl');
    var socket = io.connect("http://localhost:8000");
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
        socket.emit('checkuser',{name:logginForm.username.$viewValue,pass:logginForm.userPassword.$viewValue});
        socket.on('userLogged', function(userDB) {
            if(userDB!=undefined){
                $log.info('Bienvenido '+userDB.name);
                user = userDB;
                $scope.username = userDB.name;
                cleanLogInFields();
                cookieService.setCookie('user',{'login': true, id:userDB.id, name:userDB.name});
                goToTop();
            }else{
                console.log('El usuario no existe '+userDB);
                alert('El usuario no existe '+userDB);
            }
        });
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