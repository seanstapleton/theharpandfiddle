(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('MainController', ['$scope','$http', function($scope, $http) {

      $scope.getHours = function() {
        $http.get('/backendServices/getHours')
          .then(function(res) {
            $scope.hours = res.data;
          });
      }

      $scope.getWelcome = function() {
        $http.get('/backendServices/loadWelcome')
          .then(function(res) {
            $scope.welcome = res.data;
          });
      }

      $scope.getHours();
      $scope.getWelcome();
  }]);
}());
