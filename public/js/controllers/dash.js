(function() {
    var app = angular.module('theharpandfiddle');

    app.controller('DashController', ['$scope', '$http', function($scope, $http) {

    $scope.eventData = {};

      $scope.loadEvents = function() {
        $http.get('/backendServices/getEvents')
          .then(function(res) {
            if (res.data) {
              $scope.events = res.data;
            }
          });
      }

      $scope.toggleEventUpload = function() {
        $(".overlay").toggleClass("show");
        $("#eventModal").toggleClass("show");
      }

      $scope.collapseEvs = function() {
        $(".collapsable-ev").toggleClass("hide");
      }

      $scope.deleteEvent = function(id) {
        var data = {id: id};
        $http.post('/backendServices/deleteEvent', data)
          .then(function(res) {
            if (res.data.success) {
              alert("Event deleted");
              $scope.loadEvents();
            } else {
              alert("An error occurred. Please try again later");
              console.log(res.data.err);
              $scope.loadEvents();
            }
          });
      }

      $scope.addEvent = function() {
        var formData = $scope.eventData;
        $http.post('/backendServices/addEvent', formData)
          .then(function(res) {
            if (res.data.success) {
              $scope.evMessage = "Go on ya mad champ! Event successfully added."
              $scope.loadEvents();
            } else {
              $scope.evMessage = "Bollocks, there's something wrong."
            }
          });
      }

      $scope.loadEvents();
    }]);

}());
