(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('EventsController', ['$scope','$http', function($scope, $http) {

    $scope.getEvents = function() {
      $http.get('/backendServices/getEvents')
        .then(function(res) {
          if (res.data) {
            $scope.events = res.data;
            $scope.loadEvents();
          }
        });
    }

    $scope.loadEvents = function() {
      $('#calendar').fullCalendar({
          theme: true,
          header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month,agendaWeek,agendaDay'
          },
          editable: false,
          weekMode: 'liquid',
          url: '#',
          events: $scope.events,
          eventRender: function(event, element) {
            if (event.title.toLowerCase().indexOf("notre dame") >= 0) {
              element.css("background", "#3EA632");
            }
            if (event.background) {
              element.css("background", event.background);
            }
            element.text(event.title);
            element.tooltip({title: event.description});
            if (event.image) {
              var image = $('<img>').attr("src",event.image);
              var oe = element;
              element = $('<div>')
              element.append(oe).append(image);
            }
          },
          eventClick: function(event, jsEvent, view) {
              window.location.href=event.url;
          }
      });
    }

    $scope.getEvents();

  }]);
}());
