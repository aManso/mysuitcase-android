suitcaseApp.controller('chooseOptionsController',
    function chooseOptionsController($scope, $log, currentTravelService, storageService, commonFunctionsService){
    $log.info('starting chooseOptionsController');

    var COUNTRIES = {
        default: 'españa'
    };
    $scope.travel = {};
    $scope.today = undefined;

    $("#destinyField")
        .geocomplete()
        .bind("geocode:result", function(event, result){
            var countryIndex = _.findIndex(result.address_components,function(comp){
                return comp.types[0] == "country";
            });
            var country = result.address_components[countryIndex].long_name.toLowerCase();
            var provinceIndex = _.findIndex(result.address_components,function(comp){
                return comp.types[0] == "administrative_area_level_2";
            });
            if(provinceIndex!=-1){
                var province = result.address_components[provinceIndex].long_name.toLowerCase();
            }
            $scope.travel.province = province;
            $scope.travel.country = country;
            $scope.travel.destiny = result.address_components[0].long_name.toLowerCase();
            $scope.$apply();
        });


    $scope.clearDestiny = function(){
        $scope.travel.province = undefined;
        $scope.travel.country = undefined;
    }

    $scope.checkForm = function(form){
        // en el caso de espana - version 1
        if($scope.travel.country === COUNTRIES.default){
            return form.$valid && $scope.travel.country!= undefined && $scope.travel.province!=undefined && $scope.travel.destiny!=undefined && (($scope.travel.date==undefined && $scope.travel.numDays==undefined) || $scope.isValidDate() || $scope.isValidNumDays());
        }
        else{
            return form.$valid && $scope.travel.country!= undefined && ($scope.travel.destiny!=undefined) && (($scope.travel.date==undefined && $scope.travel.numDays==undefined) || $scope.isValidDate() || $scope.isValidNumDays());
        }
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
            storageService.setInfoLS('travelOptions', $scope.travel);
            commonFunctionsService.goTo('makeSuitcase');
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