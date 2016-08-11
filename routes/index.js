module.exports = function(db, passport) {
    var express         = require('express');
    var router          = express.Router();
    var db              = require('../db');
    var bodyParser      = require('body-parser');
    var nodemailer      = require('nodemailer');
    var hoursSchema     = require('../models/hours.js');
    var menuSchema      = require('../models/menu.js');
    var eventsSchema    = require('../models/events.js');
    var specialsSchema  = require('../models/specials.js');
    var flash           = require('connect-flash');
    var http            = require('http');
    var Dropbox         = require('dropbox');
    var validator       = require('validator');
    var hours;

    hoursSchema.find({}, {'_id': false, 'order': false}, function(err, returnHours) {
        hours = returnHours;
    });

    /* GET home page. */
    router.get('/', function(req, res, next) {
        var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        var d = new Date();
        var str = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
        specialsSchema.find({dotw: days[d.getDay()]}, {'_id': false}, function(err, specials) {
            eventsSchema.find({start: new RegExp('^' + str)}, {'_id': false}, function(err, events) {
                console.log(events);
                res.render('index', {
                    title: 'The Harp and Fiddle',
                    hours: hours,
                    specials: JSON.stringify(specials),
                    events: JSON.stringify(events)
                });
            });
        });
    });

    /* GET dinner menu page. */
    router.get('/menu', function(req, res, next) {
        menuSchema.findOne({"type": "Dinner Menu"}, {'_id': false}, {sort: {"start": -1}}, function(err, menu) {
            res.render('menu', {
                title: 'The Harp and Fiddle - Dinner Menu',
                hours: hours,
                menu: JSON.stringify(menu)
            });
        });
    });

    /* GET lunch menu page. */
    router.get('/lunch', function(req, res, next) {
        menuSchema.findOne({"type": "Lunch Menu"}, {'_id': false}, {sort: {"start": -1}}, function(err, menu) {
            res.render('lunch', {
                title: 'The Harp and Fiddle - Lunch Menu',
                hours: hours,
                menu: JSON.stringify(menu)
            });
        });
    });

    /* GET draft beer page. */
    router.get('/draft', function(req, res, next) {
        menuSchema.findOne({"type": "Draft Beer"}, {'_id': false}, {sort: {"start": -1}}, function(err, menu) {
            res.render('draft', {
                title: 'The Harp and Fiddle - Draft Beer',
                hours: hours,
                menu: JSON.stringify(menu)
            });
        });
    });

    /* GET Beer Bottles and Cans page. */
    router.get('/bottles', function(req, res, next) {
        menuSchema.findOne({"type": "Bottles and Cans"}, {'_id': false}, {sort: {"start": -1}}, function(err, menu) {
            res.render('bottles', {
                title: 'The Harp and Fiddle - Beer',
                hours: hours,
                menu: JSON.stringify(menu)
            });
        });
    });

    /* GET wine menu page. */
    router.get('/wine', function(req, res, next) {
        menuSchema.findOne({"type": "Wine Menu"}, {'_id': false}, {sort: {"start": -1}}, function(err, menu) {
            res.render('wine', {
                title: 'The Harp and Fiddle - Wine List',
                hours: hours,
                menu: JSON.stringify(menu)
            });
        });
    });

    /* GET signature cocktails page. */
    router.get('/signature', function(req, res, next) {
        menuSchema.findOne({"type": "Signature Cocktails"}, {'_id': false}, {sort: {"start": -1}}, function(err, menu) {
            res.render('signature', {
                title: 'The Harp and Fiddle - Signature Cocktails',
                hours: hours,
                menu: JSON.stringify(menu)
            });
        });
    });

    /* GET events page. */
    router.get('/events', function(req, res, next) {
        eventsSchema.find({}, {_id: false}, function(err, events) {
            console.log(events);
            res.render('events', {
              title: 'The Harp and Fiddle - Events',
              hours: hours,
              events: events
          });
        });
    });

    /* GET contact page. */
    router.get('/contact', function(req, res, next) {
        res.render('contact', {
          title: 'The Harp and Fiddle - Contact',
          hours: hours
        });
    });

    /* POST contact page. */
    router.post('/contact', function(req, res) {
        var smtpTransporter = nodemailer.createTransport({
          service: 'Mailgun',
          auth: {
            user: 'postmaster@sandbox8942345cff734588a349b18a65da4253.mailgun.org',
            pass: 'e8ce8cf8eb9112b55cfd3f6bd09a8882'
          }
        });
        var message = {
          from: 'theharpandfiddle.com',
          to: 'fiddlersonmain@gmail.com',
          subject: 'Contact Form Submission: ' + req.body.subject,
          text: "Name: " + req.body.name + "\n" + "Phone Number: " + req.body.phnum + "\n" + "Email: " + req.body.email + "\nMessage: " + req.body.message
        };

        smtpTransporter.sendMail(message, function(err, info) {
           if (err) {
               console.log(err);
               res.render('contact', {
                  title: 'The Harp and Fiddle - error',
                  message: "Error: message did not send. Please try emailing declan@theharpandfiddle.com!",
                  hours: hours
                });
           } else {
                console.log(req.body);
                res.render('contact', {
                  title: 'The Harp and Fiddle - Thank you',
                  message: "Success! Your message was sent!",
                  hours: hours
                });
           }
        });
    });

    // /* GET login page */
    // router.get('/login', function(req, res, next) {
    //   res.render('login', {
    //     message: req.flash('loginMessage')
    //   });
    // });
    //
    // /* GET sign up page */
    // router.get('/signup', function(req, res, next) {
    //   res.render('signup', {
    //     message: req.flash('error')
    //   });
    // });
    //
    // /* POST sign up page */
    // router.post('/signup', passport.authenticate('signup', {
    //   successRedirect: '/edit_content',
    //   failureRedirect: '/signup',
    //   failureFlash: true
    // }));
    //
    // /* POST log in page */
    // router.post('/login', passport.authenticate('login', {
    //   successRedirect: '/edit_content',
    //   failureRedirect: '/login',
    //   failureFlash: true
    // }));
    //
    // /* GET edit content page */
    // router.get('/edit_content', function(req, res, next) {
    //   if (req.isAuthenticated()) {
    //     res.render('edit_content', {
    //       hours: hours
    //     });
    //   } else {
    //     res.redirect('/');
    //   }
    // });

    /* GET gallery page. */
    router.get('/gallery', function(req, res, next) {

      var dbx = new Dropbox({ accessToken: 'ICSw9A7Vq4UAAAAAAAAJsMghP3GCSWRtV0NyyvHJVk0Mu0Wb2sdJBsN45BtKMdMJ' });

      var promises = [];
      var entries = [];

      var push = function(path) {
        return new Promise((resolve, reject) => {
          dbx.sharingCreateSharedLink({path: path})
            .then(function(response) {
              resolve(response.url.slice(0,-4) + "raw=1");
            })
        });
      }

      dbx.filesListFolder({path: '/HF Photo Stream'})
        .then(function(response) {
          for (var i = 0; i < response.entries.length; i++) {
            promises.push(push(response.entries[i].path_display));
          }
          Promise.all(promises).then(values => {
            console.log("Values: ", values);
            res.render('gallery', {
                title: 'The Harp and Fiddle - Gallery',
                hours: hours,
                entries: JSON.stringify(values)
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        });

    });

    // /* GET logout page */
    // router.get('/logout', function(req, res, next) {
    //   req.logout();
    //   res.redirect('/');
    // });

    return router;
}
