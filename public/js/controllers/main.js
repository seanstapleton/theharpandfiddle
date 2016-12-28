(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('MainController', ['$scope','$http', '$location', function($scope, $http, $location) {

      $scope.getHours = function() {
        $http.get('/backendServices/getHours')
          .then(function(res) {
            $scope.hours = res.data;
          });
      }

      $scope.parseWelcome = function() {
        for (var i = 0; i < $scope.welcome.events.length; i++) {
          var rdate = new Date($scope.welcome.events[i].start);
          $scope.welcome.events[i].rdate = rdate.toDateString();
        }
      }

      $scope.getWelcome = function() {
        $http.get('/backendServices/loadWelcome')
          .then(function(res) {
            $scope.welcome = res.data;
            $scope.parseWelcome();
          });
      }

      $scope.moveTo = function(str) {
        $location.path('/' + str);
      }

      $scope.rel = function(str) {
        var d = new Date(str);
        var now = new Date();
        var later = new Date();
        later.setDate(later.getDate() + 5);

        if (d <= later && d >= now) {
          $scope.evs1 = true;
          return true;
        } else {
          return false;
        }
      }

      $scope.today = function(str) {
        var d = new Date(str);
        var now = new Date();
        if (d.toDateString() == now.toDateString()) {
          $scope.evs = true;
          return true;
        } else {
          return false;
        }
      }

      $scope.dateToString = function(str) {
        var d = new Date(str);
        return d.toDateString();
      }

      $scope.getHours();
      $scope.getWelcome();
  }]);
}());
