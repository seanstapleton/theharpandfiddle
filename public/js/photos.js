(function(){
  $(document).ready(function() {

    AOS.init();

    $.get("/backendServices/getPhotos", function(data) {
      for (var i = 0; i < data.length; i++) {
        var div = $("<div class='photo-box'></div>").css("background-image", "url('"+data[i].src+"')").attr("href", data[i].src).attr("data-aos", "zoom-in-up").attr("data-caption",data[i].caption);
        $("#photos-container").append(div);
      }
      $(".photo-box").css("height",$(".photo-box").css("width"));
    });

    $("#photos-container").slickLightbox({
      itemSelector: 'div.photo-box',
      src: 'href',
      caption: 'caption'
    });

    $(document).on('click','.photo-box', function() {
      $("#overlay, #lightbox-container").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    var isMobile = !window.matchMedia('(min-width: 960px)').matches;

    $("#menu").click(function() {
      $(this).toggleClass("open");
      if (isMobile) {
        $('.offscreen-nav').toggleClass("onscreen");
        $('.offscreen-nav-wrapper').toggleClass("onscreen-wrapper");
      } else {
        $(".top-nav").animate({width: 'toggle'});
      }
    });

    $("#close").click(function() {
      $("#overlay").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    $("#contact").click(function() {
      $("#menu").toggleClass("open");
      $('.offscreen-nav').toggleClass("onscreen");
      $('.offscreen-nav-wrapper').toggleClass("onscreen-wrapper");
      $("#overlay").toggleClass("show");
      $("#contact-form").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    $("#contact-topnav").click(function() {
      $("#overlay").toggleClass("show");
      $("#contact-form").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    $("#contact-fullscreen").submit(function(e) {
      var formData = {
        name: $("#first_name").val() + " " + $("#last_name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        message: $("#message").val()
      }

      $.post("/backendServices/sendMessage", formData, function(data) {
        $("#overlay").toggleClass("show");
        $("body").toggleClass("noscroll");
        $("#contact-form").removeClass("show");
        if (data.success) swal("Your message has been sent", "We will respond as soon as possible.", "success");
        else swal("There was an error with our servers", "Please call (269) 469-6400 or email caseysnb136@gmail.com", "error");
      });

      return false;
    });

  });
}());
