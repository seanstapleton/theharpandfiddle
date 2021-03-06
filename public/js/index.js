const $ = require('jquery');
const AOS = require('aos');
const Moment = require('moment');
const PDFJS = require('pdfjs-dist');
const swal = require('sweetalert');
const _ = require('lodash');
require('jquery-ui-bundle');

window.jQuery = $;
window.$ = $;
window.moment = Moment;

((function() {
  $(document).ready(function() {
    const introImg = $('<img>');
    introImg.load(function(evt) {
      $('#intro')
        .css('background-image',
          'linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)), '
          + `url('${$(evt.currentTarget).attr('src')}')`);
    });
    introImg.attr('src', '/img/backgrounds/wings-guiness-meal.jpg');

    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    if (iOSSafari) {
      $('#intro').css('height', 'calc(100vh - 44px)');
    }

    AOS.init({
      duration: 1000,
      once: true,
    });

    $.fn.extend({
      animateCss: function(animationName) {
        const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(`animated ${animationName}`).one(animationEnd, function() {
          $(this).removeClass(`animated ${animationName}`);
        });
      },
    });

    $("#toast-link img").on("animationend", (e) => {
        e.target.classList.remove("fadeInUp");
        e.target.classList.add("inf-pulse");
        e.target.classList.add("one-delay");
        e.target.classList.add("pulse");
    });

    let isMobile = !window.matchMedia('(min-width: 960px)').matches;

    if (!isMobile) $('#location-map iframe, .map-overlay').height($('#contact-info').height());

    $(window).resize(function() {
      isMobile = !window.matchMedia('(min-width: 960px)').matches;
    });

    $(document).on('click', '.gov-order', function(evt)  {
      evt.preventDefault();
      $('#overlay').toggleClass('show');
      $('#gameWatchDeals').toggleClass('show');
      const subsectionWidth = $('#gameWatchSubtitle').width();
      $('#dealsSubsection').width(subsectionWidth);
      $('#mainBody').toggleClass('noscroll');
    });

    $(document).on('click', '#christmas-dinner-link', function(evt) {
      $('#overlay').toggleClass('show');
      $('#christmas-dinner-popup').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
    });

    $('#menus-nav span').each(function() {
      $(this).css('background-image', `url('${$(this).attr('href')}')')`);
    });

    $('.overlayGradient').mouseover(function() {
      $('.overlayGradient').css('fill', 'url(#overlayGradientDark)');
      $(this).css('fill', 'url(#overlayGradientLight)');
    });

    $('.map-overlay, .menu-overlay').click(function() {
      $(this).addClass('hide');
      $(this).removeClass('show');
    });

    //$('#show-360').click(function() {
    //  $('#overlay').toggleClass('show');
    //  $('#tour-360').toggleClass('show');
    //  $('#mainBody').toggleClass('noscroll');
    //  $('#tour-360 iframe').animateCss('zoomIn');
    //});

    $(document).on('click', '#seeMore', function() {
      $('#overlay').toggleClass('show');
      $('#events-pu').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');

      $.get('/backendServices/events/', function(data) {
        if (data.success) {
          const formattedData = _.map(data.data, function(event) {
            const formattedEvent = event;
            formattedEvent.start = new Date(formattedEvent.start);
            formattedEvent.end = new Date(formattedEvent.end);
            return formattedEvent;
          });
          $('#events-calendar').fullCalendar({
            theme: true,
            header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month,agendaWeek,agendaDay',
            },
            editable: false,
            weekMode: 'liquid',
            url: '#',
            events: formattedData,
            eventRender: function(event, element) {
              if (_.includes(event.title.toLowerCase(), 'notre dame')) {
                element.css('background', '#3EA632');
              }
              if (event.background) {
                element.css('background', event.background);
              }
              element.text(event.title);
              element.tooltip({ title: event.description });
              if (event.image) {
                const image = $('<img>').attr('src', event.image);
                const oe = element;
                element = $('<div>');
                element.append(oe).append(image);
              }
            },
            eventClick: function(event) {
              window.location.href = event.url;
            },
          });
        }
      });
    });

    $('#menu').click(function(evt)  {
      $(evt.currentTarget).toggleClass('open');
      if (isMobile) {
        $('.offscreen-nav').toggleClass('onscreen');
        $('.offscreen-nav-wrapper').toggleClass('onscreen-wrapper');
      } else {
        $('.top-nav').animate({ width: 'toggle' });
      }
    });

    $('.offscreen-nav a').click(function() {
      $('#menu').toggleClass('open');
      $('.offscreen-nav').toggleClass('onscreen');
      $('.offscreen-nav-wrapper').toggleClass('onscreen-wrapper');
    });

    $(document).scroll(function() {
      if ($('.map-overlay').hasClass('hide')) {
        $('.map-overlay').addClass('show').removeClass('hide');
      }
      if ($('.menu-overlay').hasClass('hide')) {
        $('.menu-overlay').addClass('show').removeClass('hide');
      }
    });

    $('.datepicker').datepicker({
      onSelect: function(dateText) {
        $('input[name=\'dateval\']').val(dateText);
      },
      minDate: 0,
    });
    $('#time').selectmenu();
    $('#party').selectmenu();
    $('#time-desktop').selectmenu();
    $('#party-desktop').selectmenu();

    $.post('/backendServices/insta', function(data) {
      if (data.data) {
        const imgs = data.data.slice(0, 5);
        for (let i = 0; i < imgs.length; i += 1) {
          const div = $(`<div id='guess' data-aos='fade-left' data-aos-delay='${i * 100}' class='soc-box'></div>`);
          const overlay = $("<div class='insta-overlay'></div>");
          overlay.attr('href', imgs[i].link);
          const likes = $('<p></p>').text(imgs[i].likes.count).addClass('insta-likes');
          const comments = $('<p></p>').text(imgs[i].comments.count).addClass('insta-comments');
          let captionText = '';
          if (imgs[i].caption) {
            if (imgs[i].caption.length <= 100) {
              captionText = imgs[i].caption.text;
            } else {
              captionText = `${imgs[i].caption.text.substring(0, 100)}...`;
            }
          }
          const caption = $('<p></p>').text(captionText).addClass('insta-caption');
          overlay.append(likes, comments, caption);
          div.css('background-image', `url(${imgs[i].images.standard_resolution.url})`);
          div.append(overlay);
          $('#ig-links').append(div);
        }
        if (isMobile) {
          $('#ig-links').slick({
            autoplay: true,
            arrows: true,
            speed: 1500,
          });
        }
      }
    });

    $('#ig-links').on('mouseover', 'div', function(evt)  {
      if (!isMobile) $(evt.currentTarget).find('.insta-overlay').css('display', 'block');
    });
    $('#ig-links').on('mouseout', 'div', function(evt)  {
      if (!isMobile) $(evt.currentTarget).find('.insta-overlay').css('display', 'none');
    });
    $('#ig-links').on('click', 'div.insta-overlay', function(evt)  {
      window.open($(evt.currentTarget).attr('href'), '_blank');
    });

    $.get('/backendServices/events/featured', function(data) {
      if (data.success) {
        const evs = data.data;
        for (let i = 0; i < evs.length && i < 4; i += 1) {
          const date = Moment(evs[i].start).format('MMMM Do @ h:mm a');
          const containingDiv = $("<div class='featuredev-container'></div>");
          let l = i;
          if (isMobile) l = 7;
          const div = $(`<div class='ev-box' data-aos='fade-left' data-aos-delay=${(1400 - l * 200)} data-aos-anchor-placement='center-bottom' href='${evs[i].url || '#'}'></div>`);
          if (evs[i].img) div.css('background-image', `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${evs[i].img})`);
          if (!evs[i].noDisplay) {
            div.append($('<h4></h4>').text(evs[i].title), $('<p></p>').text(date));
            const infoDiv = $('<div class=\'ev-info-container mobile-item\'></div>');
            infoDiv.append([$('<p></p>').text(date), $('<p></p>').text(evs[i].description), $(`<a href='${evs[i].url}'></a>`).text(evs[i].url)]);
            containingDiv.append(infoDiv);
          }
          if (evs[i].htmlClass) div.addClass(evs[i].htmlClass);
          containingDiv.append(div);
          $('#featured-evs').prepend(containingDiv);
        }
        const container = $("<div class='featuredev-container' id='events-more'></div>");
        const div = $("<div class='ev-box' data-aos='fade-left' data-aos-delay='1200' data-aos-anchor-placement='center-bottom'></div>");
        div.css('background', 'linear-gradient(rgba(25,25,25,0.8), rgba(25,25,25,0), rgba(25,25,25,0.8))');
        div.append($('<h4 id=\'seeMore\'></h4>').text('See More'), $('<p></p>').text('View calendar'));
        container.append(div);
        $('#featured-evs').append(container);
        if (isMobile) $('#events-more div').attr('data-aos-delay', '0');
      }
    });

    $(".togo-link").click((evt) => {
        $("#overlay").addClass("show");
        $("#gameWatchDeals").removeClass("show");
        $(".spinner").addClass("show");
        $("#menu-modal-togo").addClass("show");
        $("#menu-modal-togo img:first-of-type").one("load").each(function() {
            if (this.complete) {
                console.log('image loaded');
                $(".spinner").removeClass("show"); 
            } else {
                console.log("hmm");
            }
        });
        evt.preventDefault();
    });

    $(".menu-icon").click((evt) => {
        $("#overlay").addClass("show"); 
        let icon = evt.target;
        if (evt.target.tagName === "P") {
            icon = evt.target.parentElement;
        }
        const classes = icon.classList;
        if (classes.contains("menu-icon-brunch")) {
            $(".spinner").addClass("show");
            $("#menu-modal-brunch").addClass("show");
            $("#menu-modal-brunch img:first-child").one("load").each(function() {
                if (this.complete) {
                    console.log('image loaded');
                    $(".spinner").removeClass("show"); 
                }
            });
        } else if (classes.contains("menu-icon-dinner")) {
            $(".spinner").addClass("show");
            $("#menu-modal-dinner").addClass("show");
            $("#menu-modal-dinner img:first-child").one("load").each(function() {
                if (this.complete) {
                    console.log('image loaded');
                    $(".spinner").removeClass("show"); 
                }
            });
        } else if (classes.contains("menu-icon-late-night")) {
            $(".spinner").addClass("show");
            $("#menu-modal-late-night").addClass("show");
            $("#menu-modal-late-night img:first-child").one("load").each(function() {
                if (this.complete) {
                    console.log('image loaded');
                    $(".spinner").removeClass("show"); 
                }
            });
        } else if (classes.contains("menu-icon-beer")) {
            $("#menu-modal-beer").addClass("show");
        }
    });

    $(document).on('click', '.menu-nav-link', function(evt)  {
      const id = $(evt.currentTarget).attr('href');
      if (id === 'beer') {
        $('#menu-viewer').removeClass('show').addClass('hide');
        $('#beer').removeClass('hide').addClass('show');
      } else {
        $('#beer').removeClass('show').addClass('hide');
        $('#menu-viewer').removeClass('hide').addClass('show');
        if ($('#menu-frame-div').attr('data-src') !== id) {
          $.get(`/backendServices/menus/menu-section/${id}`, function(data) {
            $('#menu-frame-div').empty();
            $('#menu-frame-div').append($(data));
            $('#menu-frame-div').attr('data-src', id);
          });
        }
      }
      if (isMobile) {
        if (id === 'beer') {
          $('#menu-col-2').addClass('show-mobile').removeClass('hide-mobile');
          $('#mainBody').addClass('no-scroll');
        } else {
          $('#menu-viewer').removeClass('hide').addClass('show');
          $('#menu-col-2').addClass('show-mobile').removeClass('hide-mobile');
          $('#mainBody').addClass('no-scroll');
          // $('#loader').removeClass('hide').addClass('show');
          // $('#menu-frame-div').on('load', function() {
          //   $('#loader').removeClass('show').addClass('hide');
          //   $('#menu-viewer').removeClass('hide').addClass('show');
          // });
        }
      }
    });

    $(document).on('click', '.menu-close', function() {
      $('#menu-col-2').removeClass('show-mobile').addClass('hide-mobile');
      $('#mainBody').removeClass('no-scroll');
    });

    $(document).on('click', '.ev-box', function(evt)  {
      if ($(evt.currentTarget).parent().attr('id') !== 'events-more') {
        if (isMobile) {
          $(evt.currentTarget).parent().find('.ev-info-container').slideToggle('slow');
        } else if ($(evt.currentTarget).attr('href') !== '#') {
          window.open($(evt.currentTarget).attr('href'), '_blank');
        }
      }
      evt.preventDefault();
      return false;
    });

    const renderNewPage = function(pdf, num, pointer, location) {
      pdf.getPage(num).then(function(page) {
        let newNum = num;
        const scale = 1.5;
        const viewport = page.getViewport(scale);

        const canvas = document.createElement('canvas');
        canvas.className += ` menu-page show ${pointer}`;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        page.render(renderContext).then(function() {
          $(location).append(canvas);
          newNum += 1;
          if (newNum <= pdf.numPages) renderNewPage(pdf, newNum, pointer, location);
          $('.spinner').removeClass('show');
        });
      }, function(reason) {
        console.log(`Error: ${reason}`);
      });
    };

    const displayMenu = function(src, pointer, location) {
      PDFJS.getDocument(src).promise.then(function(pdf) {
        renderNewPage(pdf, 1, pointer, location);
      });
    };

    $('.menu-box').click(function(evt)  {
      const pointer = $(evt.currentTarget).attr('data-pt');
      $('#close').attr('data-pt', pointer);
      if ($(`.${pointer}`)[0]) $(`.${pointer}`).toggleClass('show');
      else {
        displayMenu($(evt.currentTarget).attr('href'), pointer);
      }
      $('#overlay').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
    });

    $('#close').click(function() {
      $('#overlay').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
      const panels = ['#tour-360', '#food', '#drinks', '#cocktails', '#contact-form', '#job-form', '#events-pu', '#gameWatchDeals', '#menu-modal-brunch', '#menu-modal-dinner', '#menu-modal-late-night', '#menu-modal-beer', '#menu-modal-togo', '#christmas-dinner-popup'];
      for (let i = 0; i < panels.length; i += 1) {
        const p = $(panels[i]);
        if (p.hasClass('show')) p.toggleClass('show');
      }
      $('.spinner').removeClass('show');
    });

    $('#btn-oo').click(function() {
      $('#overlay').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
      $('#food').toggleClass('show');
    });

    $('a[href*="#"]:not([href="#"])').click(function(evt)  {
      if (window.location.pathname.replace(/^\//, '') === evt.currentTarget.pathname.replace(/^\//, '') && window.location.hostname === evt.currentTarget.hostname) {
        let target = $(evt.currentTarget.hash);
        target = target.length ? target : $(`[name=${evt.currentTarget.hash.slice(1)}]`);
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top,
          }, 2000);
          return false;
        }
      }
    });

    $('#contact').click(function() {
      $('#overlay').toggleClass('show');
      $('#contact-form').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
    });

    $('#contact-topnav').click(function() {
      $('#overlay').toggleClass('show');
      $('#contact-form').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
    });

    $('#email-info').click(function() {
      $('#overlay').toggleClass('show');
      $('#contact-form').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
    });

    $('.foodLink').click(function() {
      $('#overlay').toggleClass('show');
      $('#food').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
      $('.spinner').toggleClass('show');
      if ($('#food').find('canvas').length === 0) {
        const currentMenu = $('#foodMenuSelector').find(':selected');
        displayMenu(currentMenu.val(), currentMenu.text(), '#food');
      }
    });

    $('#foodMenuSelector').change(function() {
      const currentMenu = $(this).find(':selected');

      $('.spinner').toggleClass('show');

      $('#food').find('canvas').each(function() {
        if (!$(this).hasClass(currentMenu.text()) && $(this).hasClass('show')) $(this).toggleClass('show');
      });

      const menuObj = $('#food').find(`.${currentMenu.text()}`);
      if (menuObj.length !== 0 && !menuObj.hasClass('show')) {
        menuObj.toggleClass('show');
        $('.spinner').removeClass('show');
      } else if (menuObj.length === 0) {
        displayMenu(currentMenu.val(), currentMenu.text(), '#food');
      }
    });

    $('#drinksMenuSelector').change(function(evt)  {
      const currentMenu = $(evt.currentTarget).find(':selected');

      $('.spinner').toggleClass('show');

      $('#drinks').find('canvas').each(function() {
        if (!$(this).hasClass(currentMenu.text()) && $(this).hasClass('show')) $(this).toggleClass('show');
      });

      const menuObj = $('#drinks').find(`.${currentMenu.text()}`);
      if (menuObj.length !== 0 && !menuObj.hasClass('show')) {
        menuObj.toggleClass('show');
        $('.spinner').removeClass('show');
      } else if (menuObj.length === 0) {
        displayMenu(currentMenu.val(), currentMenu.text(), '#drinks');
      }
    });

    $('.drinksLink').click(function() {
      $('#overlay').toggleClass('show');
      $('#drinks').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
      $('.spinner').toggleClass('show');
      if ($('#drinks').find('canvas').length === 0) {
        const currentMenu = $('#drinksMenuSelector').find(':selected');
        displayMenu(currentMenu.val(), currentMenu.text(), '#drinks');
      }
    });

    $('.cocktailsLink').click(function() {
      $('#overlay').toggleClass('show');
      $('#cocktails').toggleClass('show');
      $('#mainBody').toggleClass('noscroll');
      $('.spinner').toggleClass('show');
      if ($('#cocktails').find('canvas').length === 0) {
        const currentMenu = $('#cocktailsMenuSelector').find(':selected');
        displayMenu(currentMenu.val(), currentMenu.text(), '#cocktails');
      }
    });

    const yyyymmdd = function(date) {
      const mm = date.getMonth() + 1; // getMonth() is zero-based
      const dd = date.getDate();

      return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd,
      ].join('-');
    };

    const setUpReservations = function(str) {
      const d = Moment(str);
      d.hours(11);
      d.minutes(59);
      const timeSelect = $('#reserve-time-block');
      const day = d.hours();
      const close = (day > 0 && day < 5) ? 21 : 22;
      const today = new Moment(); // eslint-disable-line new-cap
      const time = (d.dayOfYear() === today.dayOfYear()) ? today.hours() : d.hours();
      $('#reserve-time-block').find('option').remove();
      if (d.minutes() < 30) {
        const am = (time < 12) ? 'am' : 'pm';
        const t = (time % 12 === 0) ? 12 : time % 12;
        timeSelect.append($('<option></option>').val(`${t}:30${am}`).text(`${t}:30${am}`));
      }
      for (let i = time + 1; i < close; i += 1) {
        const am = (i < 12) ? 'am' : 'pm';
        const t = (i % 12 === 0) ? 12 : i % 12;
        timeSelect.append($('<option></option>').val(`${t}:00${am}`).text(`${t}:00${am}`));
        timeSelect.append($('<option></option>').val(`${t}:30${am}`).text(`${t}:30${am}`));
      }
      if ($('#reserve-time-block option').length === 0) {
        timeSelect.append($('<option disabled selected></option>').val('null').text('No times available'));
      }
    };
    const today = new Date();
    $('#reserve-date-block').val(yyyymmdd(today));
    setUpReservations(today);

    $('#reserve-date-block').change(function(evt)  {
      const str = $(evt.currentTarget).val();
      setUpReservations(str);
    });

    $('#reserve-table').submit(function() {
      const d = new Date($('#reserve-date-block').val()).toISOString().substring(0, 10);

      const t = $('#reserve-time-block').val();
      const p = $('#res-size').val();
      window.open(`https://www.yelp.com/reservations/the-harp-and-fiddle-park-ridge?date=${d}&time=${t}&covers=${p}`, '_blank');
      return false;
    });

    $('#contact-form form').submit(function() {
      const formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        subject: $('#subject').val(),
        message: $('#message').val(),
      };

      $.post('/backendServices/sendMessage', formData, function(data) {
        if (data.success) swal('Your message has been sent', 'We will respond as soon as possible.', 'success');
        else swal('There was an error with our servers', 'Please call (847) 720-4466 or email fiddlersonmain@gmail.com', 'error');

        $('#overlay').toggleClass('show');
        $('#mainBody').toggleClass('noscroll');
        $('#contact-form').removeClass('show');
      });

      return false;
    });

    $('#reservation fieldset').css('height', $('.datepicker').height());
  });
})());
