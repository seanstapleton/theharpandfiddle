(function() {
    var app = angular.module('theharpandfiddle');

    app.controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {

      $scope.login = function() {
          $http.post('/backendServices/login',{
              email: $scope.email,
              password: $scope.password
          }).then(function(res) {
              if(res.data.success) {
                  $window.location = '/admin/dash';
              } else {
                  $scope.loginError = true;
                  $scope.loginStatus.internalServerError = true;
              }
          });
      }
      $scope.signupStatus = {
          internalServerError: false
      }

      // $scope.addMenuItems = function() {
      //   $.get("http://localhost:3000/soupssalads.txt",function(txt){
      //       var lines = txt.split("\n");
      //       for (var i = 0; i < lines.length-1; i += 3) {
      //         var data = lines.slice(i,i+3);
      //
      //         var itemData = {
      //           title: data[1],
      //           desc: data[2],
      //           price: data[0],
      //           tags: ["brunch"],
      //           availabilities: []
      //         }
      //
      //         $http.post("/backendServices/addItem", itemData);
      //       }
      //   });
      // }
      //
      // $scope.addMenuItems();

    }]);

}());
