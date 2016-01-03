/**
 * Created by alejandromansogonzalez on 13/11/15.
 */

suitcaseApp.controller('makeSuitcaseController',function travelsController($scope, $log, $location, currentTravelService, storageService){
    $log.info('starting makeSuitcaseController');
    var socket = io.connect("http://localhost:8000");
    var travelOptions = currentTravelService.getTravelOptions();
    var travelOptionsCookies = storageService.getInfoLS('travelOptions');

    if(!travelOptions && travelOptionsCookies){
        travelOptions = travelOptionsCookies;
    }
    if(!travelOptions){
        $location.path('chooseOptions')
    }else{
        socket.emit('loadCityDefaultOptions');
        socket.on('loadCityDefaultOptionsBack', function(defOptions) {

        });
        socket.emit('loadCityOptions', travelOptions.city, travelOptions.country);
        socket.on('loadCityOptionsBack', function(cityOptions) {

        });
    }
});