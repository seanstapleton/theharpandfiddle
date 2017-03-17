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
      console.log("yo", $scope.events);
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

      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      var events = $scope.events;

      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      for (var i = 0; i < events.length; i++) {
          var eventDate = events[i].start.split("-");
          events[i].date = new Date(eventDate[0], parseInt(eventDate[1]) - 1, eventDate[2].split(" ")[0], eventDate[2].split(" ")[1].split(":")[0], eventDate[2].split(" ")[1].split(":")[1]);
          events[i].dateString = months[events[i].date.getMonth()] + " " + events[i].date.getDate();
      }

      events.sort(function(a, b) {
          return new Date(a.date) - new Date(b.date);
      });

      var formatDate = function(d) {
          var h = d.getHours();
          var m = ("0" + d.getMinutes()).slice(-2);
          var t = h >= 12 ? (h - 12) + ":" + m + "pm" : h + ":" + m + "am";
          return t;
      }

      for (var i = 0; i < events.length; i++) {
          var now = new Date();
          if (events[i].date.getTime() >= now.getTime()) {
              var tr = $('<tr></tr>');
              var title = $('<td></td>');
              var link = $('<a></a>').text(events[i].title);
              link.attr("href", events[i].url);
              //#16264C
              link.css("color", "#000");
              title.append(link);
              var date = $('<td></td>').text(events[i].dateString);
              var description = $('<td></td>').text(events[i].description);

              var eventDate = events[i].start.split("-");
              var moment1 = moment([eventDate[0], parseInt(eventDate[1]) - 1, eventDate[2]]).utcOffset(-360);
              var today = moment().utcOffset(-360);
              //var cd = $('<td></td>').text(today.to(moment1));
              var cd = $('<td></td>').text(formatDate(events[i].date));

              tr.append(title, date, description, cd);
              tr.addClass("active");
              $('#eventList').append(tr);
          }
      }
    }



    $('footer').css("display", "none");
    $scope.getEvents();

  }]);
}());
