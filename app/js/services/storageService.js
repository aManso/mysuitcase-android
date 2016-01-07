var storageService = angular.module('storageService', []);
suitcaseApp.service('storageService', function($cookieStore){

    this.setCookie = function(id, data) {
        $cookieStore.put(id, data);
    };

    this.getCookie = function(id) {
        return $cookieStore.get(id);
    };

    this.removeCookie = function(id) {
        return $cookieStore.remove(id);
    };

    this.setInfoLS = function(id, data) {
        localStorage.setItem(id, JSON.stringify(data));
    };

    this.getInfoLS = function(id) {
        if(localStorage[id]) return JSON.parse(localStorage[id]);
        return undefined;
    };

    this.removeInfoLS = function(id) {
        localStorage.removeItem(id);
        return undefined;
    };

});