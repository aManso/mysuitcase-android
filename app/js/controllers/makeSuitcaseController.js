/**
 * Created by alejandromansogonzalez on 13/11/15.
 */

suitcaseApp.controller('makeSuitcaseController',function travelsController($scope, $log, $location, currentTravelService, cookieService){
    $log.info('starting makeSuitcaseController');
    var travelOptions = currentTravelService.getTravelOptions();
    var travelOptionsCookies = cookieService.getCookie('travelOptions');

    if(!travelOptions && travelOptionsCookies){
        travelOptions = travelOptionsCookies;
    }
    if(!travelOptions){
        $location.path('chooseOptions')
    }
});