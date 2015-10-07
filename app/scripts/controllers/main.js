'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
var mainApp = angular.module('jschallengeApp', ['ngRoute']);

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

mainApp.controller('MainCtrl', function ($scope, $http) {
    //Nothing to do
});


mainApp.controller('availableCarsController', function ($scope, $http) {

    // Query for a booking in 1 day from now, for 2 hours.
    var start = Date.now() + 24 * 3600 * 1000;
    var end = start + 2 * 3600 * 1000;

    //var start = Date.now();
    //var end = start + .5 * 3600 * 1000;
    var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

    $http.get(url).success(function (result) {
        //console.log('Result from the API call:', result);
        $scope.carLocations = result;
    }).error(function (err) {
        // Hum, this is odd ... contact us...
        console.error(err);
    });


});

mainApp.controller('searchCarsController', function ($scope, $http) {
    //Nothing to do
});

mainApp.controller('CarSearchController', function ($scope, $http, $location) {

    $scope.carLocations = "undefined";
    $scope.submitTheForm = function () {

        var startDateStr = $scope.searchObj.date;
        var duration = $scope.searchObj.duration;

        var startDate = new Date(parseInt(startDateStr.substring(6, 10)), parseInt(startDateStr.substring(3, 5)) - 1, parseInt(startDateStr.substring(0, 2))); //22-10-2015
        var endDate = startDate.getTime()  + parseInt(duration) * 3600 * 1000;
        var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + startDate.getTime()  + '&book_end=' + endDate;

        $http.get(url).success(function (result) {
            console.log('Result from the API call:', result);
            $scope.carLocations = result;
            $location.path('/showCarsList');
            $scope.$apply();
        }).error(function (err) {
            // Hum, this is odd ... contact us...
            console.error(err);
        });

    };

});


