'use strict';
var suitcaseApp = angular.module('suitcaseApp', ['ui.router', 'currentTravelService', 'ngCookies'])
    .config(function($stateProvider, $urlRouterProvider){
        //other possible values to redirect
        $urlRouterProvider.when('/admin','/adminArea');
        $urlRouterProvider.when('/init','/chooseOptions');
        $urlRouterProvider.when('/makesuitcase','/makeSuitcase');
        //default case
        $urlRouterProvider.otherwise("/chooseOptions");
        //states
        $stateProvider
            .state('chooseOptions',
            {
                url: "/chooseOptions",
                templateUrl:'templates/chooseOptions.html',
                controller: 'chooseOptionsController'
            })
            .state('makeSuitcase',
            {
                url: "/makeSuitcase",
                templateUrl:'../templates/makeSuitcase.html',
                controller: 'makeSuitcaseController'
            })
            .state('adminArea',
            {
                url: "/adminArea    ",
                templateUrl:'templates/adminArea.html',
                controller: 'adminAreaController'
            })
    });