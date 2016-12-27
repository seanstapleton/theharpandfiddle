(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('BeerController', ['$scope','$http', '$location', function($scope, $http, $location) {

    $scope.menutype = $location.path().replace('/','');
    $scope.cols = {one:[], two:[], three:[], four:[]};

    $scope.getMenu = function() {
      $http.get('/backendServices/getMenu', {params: {menutype: $scope.menutype}})
        .then(function(res) {
          $scope.menu = res.data;
          $scope.loadMenu();
        });
    }

    $scope.loadMenu = function() {
      var sections = $scope.menu.sections;
      console.log(sections);
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].col == 1) {
          $scope.cols.one.push(sections[i]);
        } else if (sections[i].col == 2) {
          $scope.cols.two.push(sections[i]);
        } else if (sections[i].col == 3) {
          $scope.cols.three.push(sections[i]);
        } else if (sections[i].col == 4) {
          $scope.cols.four.push(sections[i]);
        }
      }
    }

    $('footer').css("display", "none");
    $scope.getMenu();

  }]);
}());
