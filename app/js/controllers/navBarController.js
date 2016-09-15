'use strict';
suitcaseApp.controller('navBarCtrl', function navBarCtrl($scope, $log, $location, commonFunctionsService, storageService) {
    $log.info('starting navBarCtrl');
    var socket = io.connect("http://localhost:8000");
    $scope.login = {};
    $scope.forms = {
        loginUserForm : {}
    }

//    switch ($location.path()){
//        case "/chooseOptions" :
//            $scope.topButton = "Hacer maleta";
//            break;
//        case "/adminarea" :
//            topButton : "Admin area";
//            break;
//        default: $scope.topButton = "Hacer maleta";
//    }



    //    login/logout *******************************************************************************************
    $scope.isLogIn = function(){
        return commonFunctionsService.isLogIn();
    }

    $scope.logOut = function(){
        $scope.user = undefined;
        storageService.removeInfoLS('user');
        commonFunctionsService.goToTop();
    }

    $scope.goAdminArea = function(){
        $location.path("/adminarea");
    }
});