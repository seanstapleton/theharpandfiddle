(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('MenuController', ['$scope','$http','$location', function($scope, $http, $location) {

    $scope.menutype = $location.path().replace('/','');

    $scope.getMenu = function() {
      $http.get('/backendServices/getMenu', {params: {menutype: $scope.menutype}})
        .then(function(res) {
          $scope.menu = res.data;
          $scope.loadMenu();
        });
    }

    $scope.loadMenu = function() {
      var count = 0;
      var sections = $scope.menu.sections;

      for (var i = 0; i < sections.length; i++) {

          if (count >= 12) {
              var row = $('<div></div>');
              row.addClass("row");
              $('.menu').append(row);
              count -= 12;
          }
          var title = $("<h2></h2>").text(sections[i].title);
          var container = $('<div></div>');
          title.css("text-align", "center");
          container.append(title);
          container.addClass("col-md-" + sections[i].col);
          $(".menu div.row:last-child").append(container);

          var items = sections[i].items;

          for (var q = 0; q < items.length; q++) {
              var miTitle = (items[q].price > -1) ? items[q].title + " $" + items[q].price : items[q].title;
              var menuItem = $("<h3></h3>").text(miTitle);
              menuItem.css("margin-left", "5%");
              var desc = $('<p></p>').text(items[q].description);
              desc.css("margin-left", "10%");
              container.append(menuItem, desc);
          }

          count += sections[i].col;
          console.log(count);
      }
    }

    $scope.getMenu();
  }]);
}());
