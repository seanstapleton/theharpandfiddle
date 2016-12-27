(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('EventsController', ['$scope','$http', function($scope, $http) {

    $scope.getEvents = function() {
      $http.get('/backendServices/getEvents')
        .then(function(res) {
          if (res.data) {
            $scope.events = res.data;
          }
        });
    }





  }]);
}());
