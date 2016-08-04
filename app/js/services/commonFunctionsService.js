/** * Created by Alex on 25/11/2015. */

var commonFunctionsService = angular.module('commonFunctionsService', []);
suitcaseApp.service('commonFunctionsService', function($location){
    var PATHS = {
        makeSuitcase : '/makeSuitcase',
        chooseOptions : '/chooseOptions'
    };

    this.isValidPass = function(password){
        var numPattern = new RegExp('[0-9]');
        var simbPattern = /\W/;
        return password.length>=3 && numPattern.test(password) && simbPattern.test(password);
    }

    this.goTo = function(path){
        $location.path(PATHS[path])
    }
});