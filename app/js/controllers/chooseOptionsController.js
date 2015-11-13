/**
 * Created by Alex on 04/11/2015.
 */
'use strict';

suitcaseApp.controller('chooseOptionsController',function chooseOptionsController($scope, $log){
    $log.info('starting chooseOptionsController');
    $scope.travel = {}
    $scope.checkForm = function(form){
        return form.$valid && !(($scope.travel.numDays!=undefined && $scope.travel.date==undefined) || ($scope.travel.numDays!=undefined && $scope.numDays.isNaN()))
    }
    $scope.isValidDate = function() {
        return $('.datetimepicker')[0].value==="13/11/2015"
    }
    $scope.isDefinedDate = function(){
        return $('.datetimepicker')[0].value!=undefined && $('.datetimepicker')[0].value!="";
    }
    $scope.isValidNumDays = function() {
        return ($scope.travel.numDays!=undefined && !isNaN($scope.travel.numDays)) && (($scope.isValidDate() && $scope.isDefinedDate()) || !$scope.isDefinedDate())
    }
    $scope.setOptions = function(form){
        if(checkForm(form)){

        }
    }
    $(function () {
        $('.datetimepicker').datetimepicker({
            minDate: Date.now(),
            viewMode: 'years',
            format: 'DD/MM/YYYY'
        });
    });
});