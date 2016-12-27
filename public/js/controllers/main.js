(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('MainController', ['$scope','$http', function($scope, $http) {

      $scope.getHours = function() {
        $http.get('/backendServices/getHours')
          .then(function(res) {
            $scope.hours = res.data;
          });
      }
      $scope.getHours();
  }]);
}());
