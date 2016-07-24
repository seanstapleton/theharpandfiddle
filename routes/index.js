module.exports = function(db) {
    var express = require('express');
    var router = express.Router();
    var db = require('../db');
    var bodyParser = require('body-parser');
    var nodemailer = require("nodemailer");
    var hoursSchema = require('../models/hours.js');
    var menuSchema = require('../models/menu.js');
    var eventsSchema = require('../models/events.js');
    var specialsSchema = require('../models/specials.js');
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
      console.log('smtps://'+process.env.gmail_user+'%40gmail.com:'+process.env.gmail_pass+'@smtp.gmail.com');
        var smtpTrans = nodemailer.createTransport('smtps://'+process.env.gmail_user+'%40gmail.com:'+process.env.gmail_pass+'@smtp.gmail.com');

        //Mail Options
        var mailOptions = {
            from: req.body.name + '&lt;' + req.body.email + '&gt;',
            to: 'fiddlersonmain@gmail.com',
            subject: 'Contact Form Submission: ' + req.body.subject,
            text: "Name: " + req.body.name + "\n" + "Phone Number: " + req.body.phnum + "\n" + "Email: " + req.body.email + "\nMessage: " + req.body.message
        }

        smtpTrans.sendMail(mailOptions, function(err, info) {
           if (err) {
               console.log(err);
               res.render('contact', {
                  title: 'The Harp and Fiddle - error',
                  hours: err
                });
           } else {
                console.log(req.body);
                res.render('contact', {
                  title: 'The Harp and Fiddle - Thank you',
                  hours: hours
                });
           }
        });
    });

    /* GET about page. */
    router.get('/gallery', function(req, res, next) {
      res.render('gallery', {
          title: 'The Harp and Fiddle - Gallery',
          hours: hours,
          albums: [
              {
                  title: "Construction",
                  path: 'Construction',
                  contents: [{
                      src: 'drinks.jpg',
                      caption: 'A nice cold Guiness served up at our bar!'
                  },{
                      src: 'shepardspie.jpg',
                      caption: "A steaming shepard's pie right out of the kitchen!"
                  }]
              }
          ]
      });
    });

    return router;
}
