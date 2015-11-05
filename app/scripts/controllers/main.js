'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * @module - ngRoute, ngSanitize
 * # MainCtrl
 *
 * Controller of the jschallengeApp
 */
var mainApp = angular.module('jschallengeApp', ['ngRoute',  'ngSanitize']);

//Handles routing and direct to the controller and return the view associated with.
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

    when('/goToLocation/:lat/:long/:city', {
      templateUrl: 'views/mapView.html',
      controller: 'mapViewController'
    }).

    otherwise({redirectTo: '/'});

}]);

//Handles the home page.
mainApp.controller('MainCtrl', function ($scope, $http) {
  //Nothing to do
});

//Handles the default request to get the car locations
mainApp.controller('availableCarsController', function ($scope,  locationSearchFactory) {

  $scope.sortBy = 'parking_name';
  $scope.reverse = false;
  $scope.carLocations = [];
  //$scope.appSettings = appsettings;

  function searchCarLocations() {
    locationSearchFactory.getLocations().success(function (carLocations) {
      $scope.carLocations = carLocations;
    }).error(function (err) {
      console.error(err);
    });
  }

  searchCarLocations();

  $scope.doSort = function (propName) {
    $scope.sortBy = propName;
    $scope.reverse = !$scope.reverse;
  };

});

//Handles car search view
mainApp.controller('CarSearchViewController', function ($scope, $http) {
  //Nothing to do
});

//Handles car search view
/*mainApp.controller('mapViewController', function ($scope, $http, mapsCreatorFactory) {
  mapsCreatorFactory.createByCoords(40.454018, -3.509205, function (marker) {
    marker.options.labelContent = 'Autentia';
    $scope.autentiaMarker = marker;
  });

  $scope.address = '';

  $scope.map = {
    center: {
      latitude: $scope.autentiaMarker.latitude,
      longitude: $scope.autentiaMarker.longitude
    },
    zoom: 12,
    markers: [],
    control: {},
    options: {
      scrollwheel: false
    }
  };

  $scope.map.markers.push($scope.autentiaMarker);

  $scope.addCurrentLocation = function () {
    mapsCreatorFactory.createByCurrentLocation(function (marker) {
      marker.options.labelContent = 'You´re here';
      $scope.map.markers.push(marker);
      refresh(marker);
    });
  };

  $scope.addAddress = function () {
    var address = $scope.address;
    if (address !== '') {
      mapsCreatorFactory.createByAddress(address, function (marker) {
        $scope.map.markers.push(marker);
        refresh(marker);
      });
    }
  };

  function refresh(marker) {
    $scope.map.control.refresh({
      latitude: marker.latitude,
      longitude: marker.longitude
    });
  }
});*/

mainApp.controller('mapViewController', function ($scope, $routeParams) {

  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng($routeParams.lat, $routeParams.long),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  $scope.markers = [];

  var infoWindow = new google.maps.InfoWindow();

  var createMarker = function (info){

    var marker = new google.maps.Marker({
      map: $scope.map,
      position: new google.maps.LatLng(info.lat, info.long),
      title: info.city
    });
    marker.content = '<div class="infoWindowContent">' + info.city + '</div>';

    google.maps.event.addListener(marker, 'click', function(){
      infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
      infoWindow.open($scope.map, marker);
    });

    $scope.markers.push(marker);

  };

  createMarker({
    "lat": $routeParams.lat,
    "long": $routeParams.long,
    "city": $routeParams.city
  });

  $scope.openInfoWindow = function(e, selectedMarker){
    e.preventDefault();
    google.maps.event.trigger(selectedMarker, 'click');
  }

});

//Handles the car seach logic
mainApp.controller('CarSearchController', function ($scope, $http, $sce) {

  $scope.carLocationResults = "undefined";

  $scope.submitTheForm = function () {

    //Get the input values for date, time and duration.
    var startDateStr = $scope.searchObj.date; //2015-10-23
    var time = $scope.searchObj.time; //08:45
    var duration = $scope.searchObj.duration;  //3

    // Set the hours of the date object from the time input
    startDateStr.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
    var startDate = startDateStr.getTime();

    //set the end date by adding startdate and duration, millisections for UTC start date
    var endDate = startDate + parseInt(duration) * 3600 * 1000;
    var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + startDate + '&book_end=' + endDate;

    //on success response generate the cars list html and bind to the element.
    $http.get(url).success(function (result) {
      console.log('Result from the API call:', result);
      $scope.carLocationResults = result;
    }).error(function (err) {
      // Hum, this is odd ... contact us...
      console.error(err);
    });

  };

});
