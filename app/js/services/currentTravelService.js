/**
 * Created by Alex on 11/11/2015.
 */

var currentTravelService = angular.module('currentTravelService', [])
suitcaseApp.service('currentTravelService', function(){
    this.travelOptions = undefined;
    this.setTravelOptions = function(options){
        this.travelOptions = options;
    };
    this.getTravelOptions = function(){
        return this.travelOptions;
    }
});