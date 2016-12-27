(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('WelcomeController', ['$scope','$http', function($scope, $http) {
    $scope.loadWelcome = function() {
      $http.get('/backendServices/loadWelcome')
        .then(function(res) {
          $scope.welcome = res.data;
        });
    }

    $scope.loadWelcome();
  }]);
}());
