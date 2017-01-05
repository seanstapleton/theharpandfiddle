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
            eventsSchema.find({}, {'_id': false}, function(err, events) {

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

    /* GET dinner menu page. */
    router.get('/getEvents', function(req, res, next) {
        eventsSchema.find({}, {'_id': false}, {sort: {"start": -1}}, function(err, events) {
            if (events) {
              // var rel = [];
              // var date = new Date();
              // for (var i = 0; i < events.length; i++) {
              //   var d = new Date(events[i].end);
              //   if (d > new Date()) rel.push(events[i]);
              // }
              res.send(events);
            } else {
              res.end();
            }
        });
    });

    /* POST contact page. */
    router.post('/contact', function(req, res) {
        if (!req.body.name) res.send({success: false});
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
               res.send({
                  success: false
                });
           } else {
                console.log(req.body);
                res.send({
                  success: true
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
            res.send(values);
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
