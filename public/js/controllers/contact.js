(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('ContactController', ['$scope','$http', function($scope, $http) {

    $scope.formData = {};

    $scope.submit = function() {
      $http.post('/backendServices/contact', $scope.formData)
        .then(function(res) {
          if (res.data.success) {
            $scope.message = "Success! Thank you for your message.";
          } else {
            $scope.message = "Whoops! Unfortunately, this site may be broken. If you still wish to send your messsage, please contact declan@theharpandfiddle.com";
          }
        });
    }

    $('footer').css("display", "none");

  }]);
}());
