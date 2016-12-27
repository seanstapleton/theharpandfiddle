(function() {
  var app = angular.module('theharpandfiddle');
  app.controller('ContactController', ['$scope','$http', function($scope, $http) {
    $scope.submit = function() {
      var name = $('#name').val(),
          email = $('#email').val(),
          phone = $('#phnum').val(),
          subject = $('#subject').val(),
          message = $('#message').val();

          $('#name').val(validator.escape(name));
          $('#email').val(validator.escape(email));
          $('#phnum').val(validator.escape(phone));
          $('#subject').val(validator.escape(subject));
          $('#message').val(validator.escape(message));

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
