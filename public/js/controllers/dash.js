(function() {
    var app = angular.module('theharpandfiddle');

    app.controller('DashController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    $scope.pageData.current = "events";

    $scope.eventData = {};
    $scope.eventOrder = "start";

    $scope.checkStatus = function() {
      $http.get("/backendServices/isLoggedIn")
        .then(function(res) {
          console.log(res.data);
          if (!res.data.loggedIn)
            $window.location = "/admin";
          else
            $scope.userData.isLoggedIn = true;
        });
    }

    $scope.checkStatus();

      $scope.loadEvents = function() {
        $http.get('/backendServices/getEvents')
          .then(function(res) {
            if (res.data) {
              $scope.events = res.data;
            }
          });
      }

      $scope.toggleEventUpload = function() {
        $scope.mode = "new";
        $(".overlay").toggleClass("show");
        $("#eventModal").toggleClass("show");
        $scope.evMessage = false;
      }

      $scope.collapseEvs = function() {
        $(".collapsable-ev").toggleClass("hide");
      }

      $scope.editEvent = function(id) {
        $scope.mode = "edit";
        var ev = $scope.events.filter(function(obj) {
          return obj._id == id;
        })[0];
        ev.start = new Date(ev.start);
        ev.end = new Date(ev.end);
        $scope.eventData = ev;
        $(".overlay").toggleClass("show");
        $("#eventModal").toggleClass("show");
        console.log(ev);
      }

      $scope.deleteEvent = function(id) {
        var ev = $scope.events.filter(function(obj) {
          return obj._id == id;
        })[0];
        if (confirm('Are you sure you want to DELETE "'+ev.title+'"?')) {
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
      }

      $scope.linkDrivePhoto = function() {
        var url = $scope.eventData.img;
        if (url.indexOf("drive.google.com") > -1) {
          var tokens = url.split("/");
          $scope.eventData.img = "https://www.drive.google.com/uc?id=" + tokens[tokens.indexOf("d")+1];
        } else if (url.indexOf("dropbox.com") > -1) {
          $scope.eventData.img = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
        }
      }

      $scope.uploadEvent = function() {
        var serv;
        if ($scope.mode == "new") serv = "addEvent";
        else if ($scope.mode == "edit") serv = "editEvent";
        $scope.eventData.start = new Date($scope.eventData.start.getTime());
        $scope.eventData.end = new Date($scope.eventData.end.getTime());
        var formData = $scope.eventData;
        $http.post('/backendServices/' + serv, formData)
          .then(function(res) {
            if (res.data.success) {
              var change = ($scope.mode == "new") ? "added" : "updated";
              $scope.evMessage = "Go on ya mad champ! Event successfully " + change + ".";
              $scope.loadEvents();
            } else {
              $scope.evMessage = "Bollocks, there's something wrong."
            }
          });
      }

      $scope.updateFeatured = function(ev) {
        var upEvent = {
          "_id": ev._id,
          title: ev.title,
          start: new Date(ev.start),
          end: new Date(ev.end),
          description: ev.description,
          url: ev.url,
          img: ev.img
        };

        var el = $("#fav-" + ev._id);
        upEvent.featured = !(el.attr("data-checked") == "true");
        el.attr("data-checked", upEvent.featured);

        $http.post('/backendServices/editEvent', upEvent)
          .then(function(res) {
            if (!res.data.success) {
              alert("Sorry, your change was unsuccessful.");
            }
          });
      }

      $scope.loadEvents();
    }]);

    app.filter('dateInMillis', function() {
      return function(dateString) {
        return Date.parse(dateString);
      };
    });

}());
