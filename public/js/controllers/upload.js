(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('UploadController', ['$scope','$http', function($scope, $http) {

    $scope.formData = {};

    $scope.submit = function() {
      $http.post('/backendServices/eventUpload', $scope.formData)
        .then(function(res) {
          $scope.formData = {};
          alert("completed");
        })
    }

    $('footer').css("display", "none");

  }]);
}());
