'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
var mainApp = angular.module('jschallengeApp',['ngRoute']);

mainApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).

    when('/searchCars', {
      templateUrl: 'views/searchCar.html',
      controller: 'searchCarsController'
    }).

    when('/showCarsList', {
      templateUrl: 'views/availableCars.html',
      controller: 'availableCarsController'
    }).

    otherwise({redirectTo: '/'});

}]);

mainApp.controller('MainCtrl', function($scope, $http) {
  //Nothing to do
});


mainApp.controller('availableCarsController', function($scope, $http) {

  // Query for a booking in 1 day from now, for 2 hours.
  var start = Date.now() + 24 * 3600 * 1000;
  var end = start + 2 * 3600 * 1000;

  //var start = Date.now();
  //var end = start + .5 * 3600 * 1000;
  var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

  $http.get(url).success(function(result) {
    //console.log('Result from the API call:', result);
    $scope.carLocations = result;
  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });


});

mainApp.controller('searchCarsController', function($scope, $http) {
  //Nothing to do
});

mainApp.directive('myDatepicker', function () {
  return {
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      $(function(){
        element.datepicker({
          showOn:"both",
          changeYear:true,
          changeMonth:true,
          dateFormat:'yy-mm-dd',
          maxDate: new Date(),
          yearRange: '1920:2012',
          onSelect:function (dateText, inst) {
            ngModelCtrl.$setViewValue(dateText);
            scope.$apply();
          }
        });
      });
    }
  }
});


function MyCtrl($scope) {

  $scope.userInfo = {
    person: {
      mDate: '1967-10-07'
    }
  };

}


