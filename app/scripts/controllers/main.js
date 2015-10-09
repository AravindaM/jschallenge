'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
var mainApp = angular.module('jschallengeApp', ['ngRoute',  'ngSanitize']);

mainApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).

    when('/searchCars', {
      templateUrl: 'views/searchCar.html',
      controller: 'CarSearchViewController'
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


mainApp.controller('availableCarsController', function ($scope, $routeParams, $http) {

  if ($scope.carLocations === undefined) {
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
  }

});

mainApp.controller('CarSearchViewController', function ($scope, $http) {
  //Nothing to do
});

mainApp.controller('CarSearchController', function ($scope, $http, $sce) {

  $scope.carLocations = "undefined";
  $scope.submitTheForm = function () {

    var startDateStr = $scope.searchObj.date; //2015-10-23
    var time = $scope.searchObj.time; //08:45
    var duration = $scope.searchObj.duration;  //3

    startDateStr.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
    var startDate = startDateStr.getTime();

    var endDate = startDate + parseInt(duration) * 3600 * 1000;
    var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + startDate + '&book_end=' + endDate;

    $http.get(url).success(function (result) {
      console.log('Result from the API call:', result);
      $scope.carLocationResults =  generateCarsList(result);
    }).error(function (err) {
      // Hum, this is odd ... contact us...
      console.error(err);
    });

  };

});

var generateCarsList = function (carLocations) {

  var htmlString = '<div class="jumbotron"><h4>Available Cars</h4><table class="table  table-hover"><tbody><tr><td></td><td><blockquote>Car Collection Location</blockquote></td>';

  htmlString += '<td><blockquote>Available Cars</blockquote></td><td><blockquote>Details</blockquote></td></tr>';


  var index = 1;
  for (var carLocation in carLocations) {
    htmlString += '<tr>'
      + '<td>' + index + '</td>'
      + '<td>' + carLocations[carLocation].parking_name + '<a href="http://maps.google.com/maps?z=12&t=m&q=loc:' + carLocations[carLocation].latitude + '+' + carLocations[carLocation].longitude + '"><h6>(Map &#62;&#62;)</h6></a></td>';
      +'<td>' + carLocations[carLocation].cars_available + '</td>' + +'<td>' + carLocations[carLocation].description + '</td>' +
    '</tr>'
  }

  '</tbody>' +
  '</table>' +
  '</div>';

  return htmlString;

};
