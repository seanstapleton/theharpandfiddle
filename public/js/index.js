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

((() => {
  $(document).ready(() => {
    const introImg = $('<img>');
    introImg.load((evt) => {
      $('#intro')
        .css('background-image',
          'linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)), '
          + `url('${$(evt.currentTarget).attr('src')}')`);
    });
    introImg.attr('src', '/img/backgrounds/op/bar.jpg');

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
      animateCss: (animationName) => {
        const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(`animated ${animationName}`).one(animationEnd, () => {
          $(this).removeClass(`animated ${animationName}`);
        });
      },
    });


    let isMobile = !window.matchMedia('(min-width: 960px)').matches;

    if (!isMobile) $('#location-map iframe, .map-overlay').height($('#contact-info').height());

    $(window).resize(() => {
      isMobile = !window.matchMedia('(min-width: 960px)').matches;
    });

    $('#menus-nav span').each(() => {
      $(this).css('background-image', `url('${$(this).attr('href')}')')`);
    });

    $('.overlayGradient').mouseover(() => {
      $('.overlayGradient').css('fill', 'url(#overlayGradientDark)');
      $(this).css('fill', 'url(#overlayGradientLight)');
    });

    $('.map-overlay, .menu-overlay').click(() => {
      $(this).addClass('hide');
      $(this).removeClass('show');
    });

    $('#show-360').click(() => {
      $('#overlay').toggleClass('show');
      $('#tour-360').toggleClass('show');
      $('body').toggleClass('noscroll');
      $('#tour-360 iframe').animateCss('zoomIn');
    });

    $(document).on('click', '#events-more', () => {
      $('#overlay').toggleClass('show');
      $('#events-pu').toggleClass('show');
      $('body').toggleClass('noscroll');

      $.get('/backendServices/events/', (data) => {
        if (data.success) {
          const formattedData = _.map(data.data, (event) => {
            const formattedEvent = event;
            formattedEvent.start = new Date(formattedEvent.start);
            formattedEvent.end = new Date(formattedEvent.end);
            return formattedEvent;
          });
          console.log(formattedData);
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
            eventRender: (event, element) => {
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
            eventClick: (event) => {
              window.location.href = event.url;
            },
          });
        }
      });
    });

    $('#menu').click((evt) => {
      $(evt.currentTarget).toggleClass('open');
      if (isMobile) {
        $('.offscreen-nav').toggleClass('onscreen');
        $('.offscreen-nav-wrapper').toggleClass('onscreen-wrapper');
      } else {
        $('.top-nav').animate({ width: 'toggle' });
      }
    });

    $('.offscreen-nav a').click(() => {
      $('#menu').toggleClass('open');
      $('.offscreen-nav').toggleClass('onscreen');
      $('.offscreen-nav-wrapper').toggleClass('onscreen-wrapper');
    });

    $(document).scroll(() => {
      if ($('.map-overlay').hasClass('hide')) {
        $('.map-overlay').addClass('show').removeClass('hide');
      }
      if ($('.menu-overlay').hasClass('hide')) {
        $('.menu-overlay').addClass('show').removeClass('hide');
      }
    });

    $('.datepicker').datepicker({
      onSelect: (dateText) => {
        $('input[name=\'dateval\']').val(dateText);
      },
      minDate: 0,
    });
    $('#time').selectmenu();
    $('#party').selectmenu();
    $('#time-desktop').selectmenu();
    $('#party-desktop').selectmenu();

    $.post('/backendServices/insta', (data) => {
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

    $('#ig-links').on('mouseover', 'div', (evt) => {
      if (!isMobile) $(evt.currentTarget).find('.insta-overlay').css('display', 'block');
    });
    $('#ig-links').on('mouseout', 'div', (evt) => {
      if (!isMobile) $(evt.currentTarget).find('.insta-overlay').css('display', 'none');
    });
    $('#ig-links').on('click', 'div.insta-overlay', (evt) => {
      window.open($(evt.currentTarget).attr('href'), '_blank');
    });

    $(document).on('mouseover', '#menus-canvas.inactive', () => {
      if (!isMobile) $('#menu-overlay').addClass('show');
    });

    $('#menu-overlay').click((event) => {
      $('#menus-canvas').removeClass('inactive').addClass('active');
      $(event.currentTarget).removeClass('show');
      $('body').css('overflow', 'hidden');
    });

    $(document).on('mouseout', '#menus-canvas.inactive', () => {
      $('#menu-overlay').removeClass('show');
    });

    $(document).on('mouseout', '#menus-canvas', () => {
      $('body').css('overflow', 'initial');
    });

    $.get('/backendServices/events/featured', (data) => {
      if (data.success) {
        const evs = data.data;
        for (let i = 0; i < evs.length && i < 4; i += 1) {
          const date = Moment(evs[i].start).format('MMMM Do @ h:mm a');
          const containingDiv = $("<div class='featuredev-container'></div>");
          let l = i;
          if (isMobile) l = 7;
          const div = $(`<div class='ev-box' data-aos='fade-left' data-aos-delay=${(1400 - l * 200)} data-aos-anchor-placement='center-bottom' href='${evs[i].url || '#'}'></div>`);
          if (evs[i].img) div.css('background-image', `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${evs[i].img})`);
          div.append($('<h4></h4>').text(evs[i].title), $('<p></p>').text(date));
          containingDiv.append(div);
          const infoDiv = $('<div class=\'ev-info-container mobile-item\'></div>');
          infoDiv.append([$('<p></p>').text(date), $('<p></p>').text(evs[i].description), $(`<a href='${evs[i].url}'></a>`).text(evs[i].url)]);
          containingDiv.append(infoDiv);
          $('#featured-evs').prepend(containingDiv);
        }
        const container = $("<div class='featuredev-container' id='events-more'></div>");
        const div = $("<div class='ev-box' data-aos='fade-left' data-aos-delay='1200' data-aos-anchor-placement='center-bottom'></div>");
        div.css('background', 'linear-gradient(rgba(25,25,25,0.8), rgba(25,25,25,0), rgba(25,25,25,0.8))');
        div.append($('<h4></h4>').text('See More'), $('<p></p>').text('View calendar'));
        container.append(div);
        $('#featured-evs').append(container);
        if (isMobile) $('#events-more div').attr('data-aos-delay', '0');
      }
    });

    const loadMenuCanvas = (menus) => {
      for (let i = 0; i < menus.length; i += 1) {
        const paragraph = $(`<p href='${menus[i].id.replace(/\W/g, '')}'></p>`).text(menus[i].id);
        const iconBackground = menus[i].icon_path;
        const span = $(`<span class='menu-icon' style='background-image: url("${iconBackground}")'></span>`);
        paragraph.append(span).addClass('menu-nav-link');
        const pdiv = $("<div class='menu-nav-container'></div>");
        pdiv.append(paragraph);
        $('#menus-nav').prepend(pdiv);
      }
    };

    $.get('/backendServices/menus', (data) => {
      if (data.success) {
        const menus = data.data;
        $('#menu-viewer iframe').attr('src', `/views/menu-section.html?menu=${menus[menus.length - 1].id}`);
        loadMenuCanvas(menus);
      }
    });

    $(document).on('click', '.menu-nav-link', (evt) => {
      const id = $(evt.currentTarget).attr('href');
      if (id === 'beer') {
        $('#menu-viewer').removeClass('show').addClass('hide');
        $('#beer').removeClass('hide').addClass('show');
      } else {
        $('#beer').removeClass('show').addClass('hide');
        $('#menu-viewer').removeClass('hide').addClass('show');
        if ($('#menu-viewer iframe').attr('src') !== `/views/menu-section.html?menu=${id}`) {
          $('#menu-viewer iframe').attr('src', `/views/menu-section.html?menu=${id}`);
        }
      }
      if (isMobile) {
        if (id === 'beer') {
          $('#menu-col-2').addClass('show-mobile').removeClass('hide-mobile');
          $('body').addClass('no-scroll');
        } else {
          $('#menu-viewer').removeClass('show').addClass('hide');
          $('#menu-col-2').addClass('show-mobile').removeClass('hide-mobile');
          $('body').addClass('no-scroll');
          $('#loader').removeClass('hide').addClass('show');
          $('#menu-frame').on('load', () => {
            $('#loader').removeClass('show').addClass('hide');
            $('#menu-viewer').removeClass('hide').addClass('show');
          });
        }
      }
    });

    $(document).on('click', '.menu-close', () => {
      $('#menu-col-2').removeClass('show-mobile').addClass('hide-mobile');
      $('body').removeClass('no-scroll');
    });

    $(document).on('click', '.ev-box', (evt) => {
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

    const renderNewPage = (pdf, num, pointer, location) => {
      pdf.getPage(num).then((page) => {
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
        page.render(renderContext).then(() => {
          $(location).append(canvas);
          newNum += 1;
          if (newNum <= pdf.numPages) renderNewPage(pdf, newNum, pointer, location);
          $('.spinner').removeClass('show');
        });
      }, (reason) => {
        console.log(`Error: ${reason}`);
      });
    };

    const displayMenu = (src, pointer, location) => {
      PDFJS.getDocument(src).promise.then((pdf) => {
        renderNewPage(pdf, 1, pointer, location);
      });
    };

    $('.menu-box').click((evt) => {
      const pointer = $(evt.currentTarget).attr('data-pt');
      $('#close').attr('data-pt', pointer);
      if ($(`.${pointer}`)[0]) $(`.${pointer}`).toggleClass('show');
      else {
        displayMenu($(evt.currentTarget).attr('href'), pointer);
      }
      $('#overlay').toggleClass('show');
      $('body').toggleClass('noscroll');
    });

    $('#close').click(() => {
      $('#overlay').toggleClass('show');
      $('body').toggleClass('noscroll');
      const panels = ['#tour-360', '#food', '#drinks', '#cocktails', '#contact-form', '#job-form', '#events-pu'];
      for (let i = 0; i < panels.length; i += 1) {
        const p = $(panels[i]);
        if (p.hasClass('show')) p.toggleClass('show');
      }
      $('.spinner').removeClass('show');
    });

    $('#btn-oo').click(() => {
      $('#overlay').toggleClass('show');
      $('body').toggleClass('noscroll');
      $('#food').toggleClass('show');
    });

    $('a[href*="#"]:not([href="#"])').click((evt) => {
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

    $('#contact').click(() => {
      $('#overlay').toggleClass('show');
      $('#contact-form').toggleClass('show');
      $('body').toggleClass('noscroll');
    });

    $('#contact-topnav').click(() => {
      $('#overlay').toggleClass('show');
      $('#contact-form').toggleClass('show');
      $('body').toggleClass('noscroll');
    });

    $('#email-info').click(() => {
      $('#overlay').toggleClass('show');
      $('#contact-form').toggleClass('show');
      $('body').toggleClass('noscroll');
    });

    $('.foodLink').click(() => {
      $('#overlay').toggleClass('show');
      $('#food').toggleClass('show');
      $('body').toggleClass('noscroll');
      $('.spinner').toggleClass('show');
      if ($('#food').find('canvas').length === 0) {
        const currentMenu = $('#foodMenuSelector').find(':selected');
        displayMenu(currentMenu.val(), currentMenu.text(), '#food');
      }
    });

    $('#foodMenuSelector').change(() => {
      const currentMenu = $(this).find(':selected');

      $('.spinner').toggleClass('show');

      $('#food').find('canvas').each(() => {
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

    $('#drinksMenuSelector').change((evt) => {
      const currentMenu = $(evt.currentTarget).find(':selected');

      $('.spinner').toggleClass('show');

      $('#drinks').find('canvas').each(() => {
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

    $('.drinksLink').click(() => {
      $('#overlay').toggleClass('show');
      $('#drinks').toggleClass('show');
      $('body').toggleClass('noscroll');
      $('.spinner').toggleClass('show');
      if ($('#drinks').find('canvas').length === 0) {
        const currentMenu = $('#drinksMenuSelector').find(':selected');
        displayMenu(currentMenu.val(), currentMenu.text(), '#drinks');
      }
    });

    $('.cocktailsLink').click(() => {
      $('#overlay').toggleClass('show');
      $('#cocktails').toggleClass('show');
      $('body').toggleClass('noscroll');
      $('.spinner').toggleClass('show');
      if ($('#cocktails').find('canvas').length === 0) {
        const currentMenu = $('#cocktailsMenuSelector').find(':selected');
        displayMenu(currentMenu.val(), currentMenu.text(), '#cocktails');
      }
    });

    const yyyymmdd = (date) => {
      const mm = date.getMonth() + 1; // getMonth() is zero-based
      const dd = date.getDate();

      return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd,
      ].join('-');
    };

    const setUpReservations = (str) => {
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

    $('#reserve-date-block').change((evt) => {
      const str = $(evt.currentTarget).val();
      setUpReservations(str);
    });

    $('#reserve-table').submit(() => {
      const d = new Date($('#reserve-date-block').val()).toISOString().substring(0, 10);

      const t = $('#reserve-time-block').val();
      const p = $('#res-size').val();
      window.open(`https://www.yelp.com/reservations/the-harp-and-fiddle-park-ridge?date=${d}&time=${t}&covers=${p}`, '_blank');
      return false;
    });

    $('#contact-form form').submit(() => {
      const formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        subject: $('#subject').val(),
        message: $('#message').val(),
      };

      $.post('/backendServices/sendMessage', formData, (data) => {
        if (data.success) swal('Your message has been sent', 'We will respond as soon as possible.', 'success');
        else swal('There was an error with our servers', 'Please call (847) 720-4466 or email fiddlersonmain@gmail.com', 'error');

        $('#overlay').toggleClass('show');
        $('body').toggleClass('noscroll');
        $('#contact-form').removeClass('show');
      });

      return false;
    });

    $('#reservation fieldset').css('height', $('.datepicker').height());
  });
})());
