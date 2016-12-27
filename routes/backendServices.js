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

    router.get('/getHours', function(req, res, next) {
      res.send(hours);
    });

    /* GET home page. */
    router.get('/loadWelcome', function(req, res, next) {
        var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        var d1 = new Date();
        var d = new Date(d1.getTime() - 18000000);
        var str = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
        specialsSchema.find({dotw: days[d.getDay()]}, {'_id': false}, function(err, specials) {
            eventsSchema.find({start: new RegExp('^' + str)}, {'_id': false}, function(err, events) {

              var dbx = new Dropbox({ accessToken: process.env.dropbox_token });

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
                    res.send({
                        entries: values,
                        specials: specials,
                        events: events
                    });
                  });
                })
                .catch(function(error) {
                  console.log(error);
                });
            });
        });
    });

    /* GET dinner menu page. */
    router.get('/getMenu', function(req, res, next) {
        menuSchema.findOne({"type": new RegExp('^' + req.query.menutype, "i")}, {'_id': false}, {sort: {"start": -1}}, function(err, menu) {
            console.log(req.query.menutype);
            console.log(menu, err);
            res.send(menu);
        });
    });

    /* GET ladies night page. */
    router.get('/ladiesnight', function(req, res, next) {
        res.render('ladiesnight', {
          title: 'The Harp and Fiddle - Dinner Menu',
          hours: hours
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

    /* GET gallery page. */
    router.get('/gallery', function(req, res, next) {

      var dbx = new Dropbox({ accessToken: process.env.dropbox_token });

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

    /* GET cc reservation page. */
    router.get('/cc-res', function(req, res, next) {
        res.render('cc-res', {
          title: 'The Harp and Fiddle - Celebrity Chef Reservation',
          hours: hours
        });
    });

    /* GET events addition  page. */
    router.get('/add-event', function(req, res, next) {
        res.render('add-event', {
          title: 'The Harp and Fiddle - Add an event',
          hours: hours
        });
    });

    /* GET events removal  page. */
    router.get('/remove-event', function(req, res, next) {
        res.render('remove-event', {
          title: 'The Harp and Fiddle - Remove an event',
          hours: hours
        });
    });

    /* POST add events page. */
    router.post('/add-event', function(req, res) {

        console.log(req.body);

        var start = req.body.evdate + " " + req.body.evtime_start;
        var end = req.body.evdate + " " + req.body.evtime_end;

        var ev = (req.body.url) ? new eventsSchema({title: req.body.evtitle, start: start, end: end, description: req.body.evdesc, url: req.body.url}) : new eventsSchema({title: req.body.evtitle, start: start, end: end, description: req.body.evdesc});

        console.log(process.env.emp);

        if (req.body.evpassword == process.env.emp) {
          ev.save(function(err) {
            if (err) {
              console.log(err)
              res.render('add-event', {
                 title: 'The Harp and Fiddle - error',
                 message: "Error: Save Failed. Try using mlab.com",
                 hours: hours
               });
            } else {
              res.render('add-event', {
                 title: 'The Harp and Fiddle - error',
                 message: "Save Successful!",
                 hours: hours
               });
            }
          });
        } else {
          res.render('add-event', {
             title: 'The Harp and Fiddle - error',
             message: "Error: Password Incorrect",
             hours: hours
           });
        }


    });

    /* POST remove events page. */
    router.post('/remove-event', function(req, res) {
      if (req.body.evdate) {
        eventsSchema.find({start: new RegExp('^' + req.body.evdate)}, {'_id': false}, function(err, events) {
          if (err) {
            console.log(err);
            res.render('remove-event', {
               title: 'The Harp and Fiddle - error',
               message: "Error: Could not complete search!",
               hours: hours
             });
          } else {
            res.render('remove-event', {
               title: 'The Harp and Fiddle - error',
               hours: hours,
               events: events
             });
          }
        });
      }

    });

    /* POST cc reservation page. */
    router.post('/cc-res', function(req, res) {
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
          subject: 'Celebrity Chef Reservation: ' + req.body.name,
          text: "Name: " + req.body.name + "\n" + "Phone Number: " + req.body.phnum + "\n" + "Email: " + req.body.email + "\nParty Size: " + req.body.party
        };

        smtpTransporter.sendMail(message, function(err, info) {
           if (err) {
               console.log(err);
               res.render('cc-res', {
                  title: 'The Harp and Fiddle - error',
                  message: "Error: message did not send. Please try emailing declan@theharpandfiddle.com!",
                  hours: hours
                });
           } else {
                console.log(req.body);
                res.render('cc-res', {
                  title: 'The Harp and Fiddle - Thank you',
                  message: "Success! Your reservation is set!",
                  hours: hours
                });
           }
        });
    });

    // /* GET logout page */
    // router.get('/logout', function(req, res, next) {
    //   req.logout();
    //   res.redirect('/');
    // });

    return router;
}
