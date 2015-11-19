/**
 * Created by Alex on 14/11/2015.
 */
var cacheService = angular.module('cacheService', [])
suitcaseApp.service('cacheService',function($cacheFactory){
    var currentTravelCache = $cacheFactory('currentTravelCache', {capacity: 3});
    this.setCurrentTravel = function(data){
        currentTravelCache.put('currentTravelOptions', data);
    }
    this.getCurrentTravel = function(){
        return currentTravelCache.get('currentTravelOptions');
    }
})