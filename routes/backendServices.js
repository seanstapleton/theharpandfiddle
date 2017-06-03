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
    var messageSchema   = require('../models/message.js');
    var flash           = require('connect-flash');
    var https           = require('https');
    var Dropbox         = require('dropbox');
    var validator       = require('validator');
    var path            = require('path');
    var mg              = require('nodemailer-mailgun-transport');

    router.post('/insta', function(req, response, next) {

      const https = require('https');

      https.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + process.env.igaccess, (res) => {

        res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => rawData += chunk);
          res.on('end', () => {
            try {
              let parsedData = JSON.parse(rawData);
              response.send(parsedData);
            } catch (e) {
              console.log(e.message);
            }
          });
      }).on('error', (e) => {
        console.error(e);
      });
    });

    router.get('/getFBID', function(req, res) {
      return res.send(process.env.fbid);
    });

    var LocalStrategy = require('passport-local').Strategy;
    require('../passport/config.js')(passport);
    router.post('/register', function(req, res, next) {
        passport.authenticate('register', function(err, newUser, info) {
          if (err) return next(err);
          if (!newUser) return res.send({success: false});
        })(req,res,next);
    });

    router.post('/login', function(req, res, next) {
      console.log("body parsing: ", req.body);
      passport.authenticate('login', function(err, user, info) {
        if (err) {
          console.log("error: ", err);
          return next(err);
        }
        if (!user) {
          console.log("error user");
          return res.send({success: false});
        }
        req.login(user, loginErr => {
            if(loginErr) {
                return next(loginErr);
            }
            return res.send({success: true});
        });
      })(req, res, next);
    });

    var isLoggedIn = function(req, res, next) {
      console.log("checking login");
      if (req.isAuthenticated()) {
        console.log("logged in");
        return res.send({loggedIn: true});
      } else {
        return res.send({loggedIn: false});
      }
    }

    router.get('/getEvents', function(req, res) {
      eventsSchema.find({}, {}, {sort: {"start": -1}}, function(err, events) {
            if (events) {
              res.send(events);
            } else {
              res.end();
            }
        });
    });

    router.post('/addEvent', function(req, res, next) {
      var event = new eventsSchema({
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
          description: req.body.description,
          allDay: false,
          url: req.body.url,
          img: req.body.img,
          featured: req.body.featured
      });
      event.save(function(err, ev) {
        if (err) return res.send({success: false, err: err});
        else return res.send({success: true});
      });
      console.log(req.body);
    });

    router.post('/editEvent', function(req, res, next) {
      eventsSchema.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: true}, function(err, doc) {
          if (err) return res.send({success: false, err: err});
          else return res.send({success: true});
      });
    });

    router.post('/deleteEvent', function(req, res, next) {
      eventsSchema.find({_id: req.body.id}).remove(function(err, data) {
        if (err) {console.log(err); return res.send({success: false, err: err});}
        else return res.send({success: true});
      });
    });

    router.get('/featuredEvents', function(req, res) {
      eventsSchema.find({featured: true},{},{sort: {"start": -1}}, function(err, events) {
        if (err) {console.log(err); return res.send({success: false, err: err});}
        else return res.send({success: true, events: events});
      });
    });

    router.get('/isLoggedIn', function(req, res, next) {
      return isLoggedIn(req, res, next);
    });

    router.get('/logout', function(req, res, next) {
      req.logout();
      res.send("logged out");
    });

    router.post('/sendMessage', function(req, res, next) {
      var auth = {
        auth: {
          api_key: process.env.api_key,
          domain: process.env.domain
        }
      }
      var data = req.body;
      var result;
      var smtpTransporter = nodemailer.createTransport(mg(auth));
      var message = {
        from: 'fiddlersonmain@gmail.com',
        to: 'fiddlersonmain@gmail.com',
        subject: 'Contact Form: ' + data.name,
        text: "Name: " + data.name + "\nEmail: " + data.email + "\nPhone Number: " + data.phone + "\nSubject: " + data.subject + "\nMessage: " + data.message
      };

      smtpTransporter.sendMail(message, function(err, info) {
         if (err) {
            console.log(err);
            return res.send({success: false, err: err});
         } else {
            console.log(info);
            return res.send({success: true});
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
