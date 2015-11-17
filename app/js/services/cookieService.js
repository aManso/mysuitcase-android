/**
 * Created by Alex on 16/11/2015.
 */

var cookieService = angular.module('cookieService', []);
suitcaseApp.service('cookieService', function($cookieStore){

    this.setCookie = function(id, travelOptions) {
        $cookieStore.put(id, travelOptions);
    };

    this.getCookie = function(id) {
       return $cookieStore.get(id);
    };

});