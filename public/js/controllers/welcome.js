(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('WelcomeController', ['$scope','$http', function($scope, $http) {
    $scope.loadWelcome = function() {
      $http.get('/backendServices/loadWelcome')
        .then(function(res) {
          $scope.welcome = res.data;
          $scope.beginSlides();
        });
    }

    $scope.beginSlides = function() {

      var loadImg = function(src, selector) {
          var div = $('<div></div>').addClass("item");

          var $img = $("<img>");
          $img.load(function(){
            div.append($img);
            $(selector).append(div);
          });
          $img.attr("src", src);
      }

      for (var i = 0; i < $scope.welcome.entries.length; i++) {
          loadImg($scope.welcome.entries[i], '.carousel-inner');
      }

    }

    $scope.loadWelcome();
  }]);
}());
