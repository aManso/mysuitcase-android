/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('chooseOptionsController',function chooseOptionsController($scope, $log, currentTravelService){
    $log.info('starting chooseOptionsController');
    var PATHS = {makeSuitcase : '/makeSuitcase'};
    $scope.travel = {}
    $scope.today = undefined;
    $scope.checkForm = function(form){
        return form.$valid && (($scope.travel.date==undefined && $scope.travel.numDays==undefined) || $scope.isValidDate() || $scope.isValidNumDays())
    }
    $scope.isValidDate = function() {
        return $scope.travel.date instanceof Date
    }
    $scope.isValidNumDays = function() {
        return $scope.travel.numDays!=undefined && !isNaN($scope.travel.numDays) && $scope.isValidDate()
    }
    $scope.setOptions = function(form){
        if($scope.checkForm(form)){
            $log.info("valid form");
            currentTravelService.setTravelOptions($scope.travel);
            currentTravelService.getTravelOptions();
            $location.path(PATHS.makeSuitcase)
        }
    }
    $(function () {
        $('.datetimepicker').datetimepicker({
            minDate: Date.now(),
            viewMode: 'years',
            format: 'DD/MM/YYYY'
        });
    });
    $(".datetimepicker").focusout(function(){
        var inputDate = $('.datetimepicker')[0].value;
        if (inputDate){
            $scope.travel.date = new Date($('.datetimepicker')[0].value)
            $scope.$apply();
        }

    });
});