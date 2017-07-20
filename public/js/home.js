(function(){
  $(document).ready(function() {
    AOS.init({
      duration: 1000
    });

    $.fn.extend({
      animateCss: function (animationName) {
          var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          this.addClass('animated ' + animationName).one(animationEnd, function() {
              $(this).removeClass('animated ' + animationName);
          });
      }
    });


    var isMobile = !window.matchMedia('(min-width: 960px)').matches;

    if (!isMobile) $("#location-map iframe, .map-overlay").height($("#contact-info").height());

    $("#menus-nav span").each(function() {
      $(this).css("background-image", "url('" + $(this).attr("href") + "')")
    });

    $(".overlayGradient").mouseover(function() {
      $(".overlayGradient").css("fill", "url(#overlayGradientDark)");
      $(this).css("fill", "url(#overlayGradientLight)");
    });

    $(".map-overlay, .menu-overlay").click(function() {
      $(this).addClass("hide");
      $(this).removeClass("show");
    });

    $("#show-360").click(function() {
      $("#overlay").toggleClass("show");
      $("#tour-360").toggleClass("show");
      $("body").toggleClass("noscroll");
      $("#tour-360 iframe").animateCss("zoomIn");
    });

    $(document).on('click','#events-more',function() {
      $("#overlay").toggleClass("show");
      $("#events-pu").toggleClass("show");
      $("body").toggleClass("noscroll");

      $.get('/backendServices/getEvents', function(data) {
        console.log("data", data);
        for (var i = 0; i < data.length; i++) {
          data[i].start = new Date(data[i].start);
          data[i].end = new Date(data[i].end);
        }
        $('#events-calendar').fullCalendar({
              theme: true,
              header: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'month,agendaWeek,agendaDay'
              },
              editable: false,
              weekMode: 'liquid',
              url: '#',
              events: data,
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
      });

    })

    $("#menu").click(function() {
      $(this).toggleClass("open");
      if (isMobile) {
        $('.offscreen-nav').toggleClass("onscreen");
        $('.offscreen-nav-wrapper').toggleClass("onscreen-wrapper");
      } else {
        $(".top-nav").animate({width: 'toggle'});
      }
    });

    $(".offscreen-nav a").click(function() {
      $("#menu").toggleClass("open");
      $('.offscreen-nav').toggleClass("onscreen");
      $('.offscreen-nav-wrapper').toggleClass("onscreen-wrapper");
    });

    $(document).scroll(function() {
      if ($(".map-overlay").hasClass("hide")) {
        $(".map-overlay").addClass("show").removeClass("hide");
      }
      if ($(".menu-overlay").hasClass("hide")) {
        $(".menu-overlay").addClass("show").removeClass("hide");
      }
    });

    $('.datepicker').datepicker({
        onSelect: function(dateText, inst) {
          $("input[name='dateval']").val(dateText);
        },
        minDate: 0
    });
    $("#time").selectmenu();
    $("#party").selectmenu();
    $("#time-desktop").selectmenu();
    $("#party-desktop").selectmenu();

    $.post('/backendServices/insta', function(data) {
      var imgs = data.data.slice(0,5);
      for (var i = 0; i < imgs.length; i++) {
        var div = $("<div id='guess' data-aos='fade-left' data-aos-delay='"+i*100+"' class='soc-box'></div>");
        var overlay = $("<div class='insta-overlay'></div>");
        overlay.attr("href", imgs[i].link);
        var likes = $("<p></p>").text(imgs[i].likes.count).addClass("insta-likes");
        var comments = $("<p></p>").text(imgs[i].comments.count).addClass("insta-comments");
        var captionText = (imgs[i].caption == null) ? "" : (imgs[i].caption.text.length > 100) ? imgs[i].caption.text.substring(0,100) + "..." : imgs[i].caption.text;
        var caption = $("<p></p>").text(captionText).addClass("insta-caption");
        overlay.append(likes,comments,caption);
        div.css("background-image", "url(" + imgs[i].images.standard_resolution.url+")");
        div.append(overlay);
        $("#ig-links").append(div);
      }
      if (isMobile) {
        $("#ig-links").slick({
          autoplay: true,
          arrows: true,
          speed: 1500
        });
      }
    });

    $("#ig-links").on('mouseover', 'div', function() {
      if (!isMobile) $(this).find(".insta-overlay").css("display", "block");
    });
    $("#ig-links").on('mouseout', 'div', function() {
      if (!isMobile) $(this).find(".insta-overlay").css("display", "none");
    });
    $("#ig-links").on('click', 'div.insta-overlay', function() {
      window.open($(this).attr("href"), "_blank");
    });

    $(document).on('mouseover','#menus-canvas, #menus-nav', function() {
      $("body").css("overflow","hidden");
    });

    $(document).on('mouseout','#menus-canvas, #menus-nav', function() {
      $("body").css("overflow","initial");
    });

    $.get('/backendServices/featuredEvents', function(data) {
      var evs = data.events;
      console.log(evs);
      for (var i = 0; i < evs.length && i < 4; i++) {
        var date = moment(evs[i].start).format("MMMM Do @ h:mm a");
        var containing_div = $("<div class='featuredev-container'></div>");
        l = i;
        if (isMobile) l = 7;
        var div = $("<div class='ev-box' data-aos='fade-left' data-aos-delay="+(1400-l*200)+" data-aos-anchor-placement='center-bottom' href='"+evs[i].url+"'></div>");
        if (evs[i].img) div.css("background-image", "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(" + evs[i].img + ")");
        div.append($("<h4></h4>").text(evs[i].title), $("<p></p>").text(date));
        containing_div.append(div);
        var infoDiv = $("<div class='ev-info-container mobile-item'></div>");
        infoDiv.append([$("<p></p>").text(date), $("<p></p>").text(evs[i].description),$("<a href='"+evs[i].url+"'></a>").text(evs[i].url)]);
        containing_div.append(infoDiv);
        $("#featured-evs").prepend(containing_div);
      }
      var container = $("<div class='featuredev-container' id='events-more'></div>");
      var div = $("<div class='ev-box' data-aos='fade-left' data-aos-delay='1200' data-aos-anchor-placement='center-bottom'></div>");
      div.css("background", "linear-gradient(rgba(25,25,25,0.8), rgba(25,25,25,0), rgba(25,25,25,0.8))");
      div.append($("<h4></h4>").text("See More"), $("<p></p>").text("View calendar"));
      container.append(div)
      $("#featured-evs").append(container);
      if (isMobile) $("#events-more div").attr("data-aos-delay", "0");
    });

    var menus;

    var loadMenuCanvas = function() {
      for (var i = 0; i < menus.length; i++) {
        var paragraph = $("<p href='"+menus[i].id.replace(/\W/g, '')+"'></p>").text(menus[i].id);
        var icon_background = '"'+menus[i].icon_path+'"';
        var span = $("<span class='menu-icon' style='background-image: url("+icon_background+")'></span>");
        paragraph.append(span).addClass("menu-nav-link");
        var pdiv = $("<div class='menu-nav-container'></div>");
        pdiv.append(paragraph);


        var container = $("<div class='menu-container' id='"+menus[i].id.replace(/\W/g, '')+"'></div>");
        var title = $("<h2 class='menu-title'></h2>").text(menus[i].id);
        var subtitle, details;
        if (menus[i].subtitle) subtitle = $("<p class='menu-subtitle'></p>").text(menus[i].subtitle);
        if (menus[i].details) details = $("<p class='menu-details'></p>").text(menus[i].details);
        var section = $("<div class='menu-section'></div>");
        var itemDivs = [];

        for (var j = 0; j < menus[i].items.length; j++) {
          var item = menus[i].items[j];
          var itemDiv = $("<div class='menu-item'></div>");
          if (item.styles) itemDiv.css(item.styles);
          var price = $("<p class='item-prices'></p>").text(item.price);
          var itemTitle = $("<h4 class='item-title'></h4>").text(item.title);
          var itemDesc = $("<p class='item-description'></p>").text(item.desc);
          itemDiv.append(price,itemTitle,itemDesc);
          itemDivs.push(itemDiv);
        }

        container.append(title);
        if (subtitle) container.append(subtitle);
        if (details) container.append(details);
        section.append(itemDivs);
        container.append(section);

        var mobileContainer = container.clone();
        mobileContainer.attr("id",mobileContainer.attr("id")+"-mobile");
        mobileContainer.attr("class","menu-container-mobile mobile-item");
        pdiv.append(mobileContainer);
        $("#menus-nav").prepend(pdiv);

        $("#menus-canvas").prepend(container).addClass("desktop-item");
      }
      $(".menu-container:not(:first-child)").addClass("hide")
    }

    $.get('/backendServices/getMenus', function(data) {
      menus = data;
      for (var i = 0; i < menus.length; i++) menus[i].items = [];
      console.log(menus);

      $.get('/backendServices/getItems', function(data) {
        var items = data;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          for (var j = 0; j < item.tags.length; j++) {
            var obj = $.grep(menus,function(e) { return e.id.replace(/\W/g, '') == item.tags[j]});
            if (obj.length > 0) obj[0].items.push(item);
            else console.log("tag " + item.tags[j] + " not found.");
          }
        }
        loadMenuCanvas();
      });
    });


    $(document).on('click','.menu-nav-link',function() {
      var id = $(this).attr("href");
      if (isMobile) $("#"+id+"-mobile").slideToggle("slow");
      else {
        $('.menu-container').removeClass("show").addClass("hide");
        $("#" + id).removeClass("hide").addClass("show");
      }
    });

    $(document).on('click', '.ev-box', function() {
      if (!isMobile && $(this).parent().attr("id") != "events-more") {
          window.open($(this).attr("href"), "_blank");
      } else {
        $(this).parent().find(".ev-info-container").slideToggle("slow");
      }
    });


    // $.get('/backendServices/getFBID', function(fbid) {
    //   $.get('https://graph.facebook.com/parkridgebar/photos?type=uploaded&&access_token=' + fbid, function(data) {
    //     var imgs = data.data.slice(0,3);
    //     console.log(imgs);
    //     for (var i = 0; i < imgs.length; i++) {
    //       var div = $("<div data-aos='zoom-in' class='soc-box'></div>");
    //       div.css("background-image", "url(" + imgs[i].source+")");
    //       $("#fb-links").append(div);
    //     }
    //   })
    // });

    $(".menu-box").click(function() {
      var pointer = $(this).attr("data-pt");
      $("#close").attr("data-pt",pointer);
      if ($("." + pointer)[0])
        $("."+pointer).toggleClass("show");
      else {
        displayMenu($(this).attr("href"), pointer);
      }
      $("#overlay").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    var displayMenu = function(src, pointer, location) {
      PDFJS.getDocument(src).promise.then(function(pdf) {
        renderNewPage(pdf, 1, pointer, location);
      });
    }

    var renderNewPage = function(pdf, num, pointer, location) {
      pdf.getPage(num).then(function(page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);



        var canvas = document.createElement("canvas");
        canvas.className += " menu-page show " + pointer;
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext).then(function() {
          $(location).append(canvas);
          num++;
          if (num <= pdf.numPages) renderNewPage(pdf, num, pointer, location);
          $(".spinner").removeClass("show");
        });
      }, function(reason) {
        console.log("Error: " + reason);
      });
    }

    $("#close").click(function() {
      $("#overlay").toggleClass("show");
      $("body").toggleClass("noscroll");
      var panels = ["#tour-360","#food", "#drinks", "#cocktails", "#contact-form", "#job-form", "#events-pu"];
      for (var i = 0; i < panels.length; i++) {
        var p = $(panels[i]);
        if (p.hasClass("show")) p.toggleClass("show");
      }
      $(".spinner").removeClass("show");
    });

    $("#job-form form").submit(function(e) {
      var appData = {
        first_name: $("#job_first_name").val(),
        last_name: $("#job_last_name").val(),
        email: $("#job_email").val(),
        phnum: $("#job_phone").val(),
        position: $("#job_position").val(),
        message: $("#job_message").val()
      }
      $.post("/backendServices/applyToWork", appData, function(res) {
        if (res.success) {
          swal({
            title: "Your application has been submitted",
            text: "Please print and fill out the application form below and email to fiddlersonmain@gmail.com. We will contact you soon. <br/><a style='color: #2F61DB' href='/img/hf_application_for_employment.pdf' target='_blank'>Job Application</a>",
            html: true,
            type: "success"
          }, function() {
            window.open("/img/hf_application_for_employment.pdf", "_blank");
          });
        } else {
          swal({
            title: "Unfortunately, there was an error with our servers",
            text: "Please print & fill out the application form below and email to fiddlersonmain@gmail.com.<br/><a style='color: #2F61DB' href='/img/hf_application_for_employment.pdf' target='_blank'>Job Application</a>",
            html: true,
            type: "error"
          }, function() {
            window.open("/img/hf_application_for_employment.pdf", "_blank");
          });
          console.log(res.err);
        }

        $("#overlay").toggleClass("show");
        $("body").toggleClass("noscroll");
        $("#job-form").removeClass("show");
      });

      return false;
    });

    $(".jobs-trigger").click(function() {
      if ($(this).hasClass("nav-item")) {
        $("#menu").toggleClass("open");
        $('.offscreen-nav').toggleClass("onscreen");
        $('.offscreen-nav-wrapper').toggleClass("onscreen-wrapper");
      }
      $("#overlay").toggleClass("show");
      $("#job-form").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    $("#btn-oo").click(function() {
      $("#overlay").toggleClass("show");
      $("body").toggleClass("noscroll");
      $("#food").toggleClass("show");
    });

    $(function() {
      $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 2000);
            return false;
          }
        }
      });
    });

    $("#contact").click(function() {
      $("#overlay").toggleClass("show");
      $("#contact-form").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    $("#contact-topnav").click(function() {
      $("#overlay").toggleClass("show");
      $("#contact-form").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    $("#email-info").click(function() {
      $("#overlay").toggleClass("show");
      $("#contact-form").toggleClass("show");
      $("body").toggleClass("noscroll");
    });

    $(".foodLink").click(function() {
      $("#overlay").toggleClass("show");
      $("#food").toggleClass("show");
      $("body").toggleClass("noscroll");
      $(".spinner").toggleClass("show");
      if ($("#food").find("canvas").length == 0) {
        var currentMenu = $("#foodMenuSelector").find(":selected");
        displayMenu(currentMenu.val(),currentMenu.text(),"#food");
      }
    });

    $("#foodMenuSelector").change(function() {
      var currentMenu = $(this).find(":selected");

      $(".spinner").toggleClass("show");

      $("#food").find("canvas").each(function() {
        if (!$(this).hasClass(currentMenu.text()) && $(this).hasClass("show")) $(this).toggleClass("show");
      });

      var menuObj = $("#food").find("." + currentMenu.text());
      if (menuObj.length != 0 && !menuObj.hasClass("show")) {
        menuObj.toggleClass("show");
        $(".spinner").removeClass("show");
      } else if (menuObj.length == 0){
        displayMenu(currentMenu.val(),currentMenu.text(),"#food");
      }
    });

    $("#drinksMenuSelector").change(function() {
      var currentMenu = $(this).find(":selected");

      $(".spinner").toggleClass("show");

      $("#drinks").find("canvas").each(function() {
        if (!$(this).hasClass(currentMenu.text()) && $(this).hasClass("show")) $(this).toggleClass("show");
      });

      var menuObj = $("#drinks").find("." + currentMenu.text());
      if (menuObj.length != 0 && !menuObj.hasClass("show")) {
        menuObj.toggleClass("show");
        $(".spinner").removeClass("show");
      } else if (menuObj.length == 0){
        displayMenu(currentMenu.val(),currentMenu.text(),"#drinks");
      }
    });

    $(".drinksLink").click(function() {
      $("#overlay").toggleClass("show");
      $("#drinks").toggleClass("show");
      $("body").toggleClass("noscroll");
      $(".spinner").toggleClass("show");
      if ($("#drinks").find("canvas").length == 0) {
        var currentMenu = $("#drinksMenuSelector").find(":selected");
        displayMenu(currentMenu.val(),currentMenu.text(),"#drinks");
      }
    });

    $(".cocktailsLink").click(function() {
      $("#overlay").toggleClass("show");
      $("#cocktails").toggleClass("show");
      $("body").toggleClass("noscroll");
      $(".spinner").toggleClass("show");
      if ($("#cocktails").find("canvas").length == 0) {
        var currentMenu = $("#cocktailsMenuSelector").find(":selected");
        displayMenu(currentMenu.val(),currentMenu.text(),"#cocktails");
      }
    });

    Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();

      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
            ].join('-');
    };

    var setUpReservations = function(str) {
      var d = moment(str);
      d.hours(11);
      d.minutes(59);
      var timeSelect = $("#reserve-time-block");
      var day = d.hours();
      var close = (day > 0 && day < 5) ? 21 : 22;
      var today = new moment();
      var time = (d.dayOfYear() == today.dayOfYear()) ? today.hours() : d.hours();
      $("#reserve-time-block").find("option").remove();
      if (d.minutes() < 30) {
        var am = (time < 12) ? "am" : "pm";
        var t = (time % 12 == 0) ? 12 : time % 12;
        timeSelect.append($("<option></option>").val("" + t + ":30" + am).text("" + t + ":30" + am));
      }
      for (var i = time + 1; i < close; i++) {
        var am = (i < 12) ? "am" : "pm";
        var t = (i % 12 == 0) ? 12 : i % 12;
        timeSelect.append($("<option></option>").val("" + t + ":00" + am).text("" + t + ":00" + am));
        timeSelect.append($("<option></option>").val("" + t + ":30" + am).text("" + t + ":30" + am));
      }
      if ($("#reserve-time-block option").length == 0) {
        timeSelect.append($("<option disabled selected></option>").val("null").text("No times available"));
      }
    }
    var today = new Date();
    $("#reserve-date-block").val(today.yyyymmdd());
    setUpReservations(today);

    $("#reserve-date-block").change(function() {
      var str = $(this).val()
      setUpReservations(str);
    });

    $("#reserve-table").submit(function(e) {
      var d = new Date($("#reserve-date-block").val()).toISOString().substring(0,10);

      var t = $("#reserve-time-block").val();
      var p = $("#res-size").val();
      window.open("https://www.yelp.com/reservations/the-harp-and-fiddle-park-ridge?date="+d+"&time="+t+"&covers="+p, "_blank");
      return false;
    });




    $("#contact-form form").submit(function(e) {
      var formData = {
        name: $("#name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        subject: $("#subject").val(),
        message: $("#message").val()
      }

      $.post("/backendServices/sendMessage", formData, function(data) {
        if (data.success) swal("Your message has been sent", "We will respond as soon as possible.", "success");
        else swal("There was an error with our servers", "Please call (847) 720-4466 or email fiddlersonmain@gmail.com", "error");

        $("#overlay").toggleClass("show");
        $("body").toggleClass("noscroll");
        $("#contact-form").removeClass("show");
      });

      return false;
    });

    $("#reservation fieldset").css("height", $(".datepicker").height());

  });
}());
