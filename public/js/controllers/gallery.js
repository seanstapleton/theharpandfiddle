(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('GalleryController', ['$scope','$http', function($scope, $http) {

      $scope.getPhotos = function() {
        $http.get('/backendServices/gallery')
          .then(function(res) {
            $scope.photos = res.data;
          });
      }
      $scope.getPhotos();
  }]);
}());
