module.exports = function(db, passport) {
    var express         = require('express');
    var router          = express.Router();
    var db              = require('../db');
    var bodyParser      = require('body-parser');
    var nodemailer      = require('nodemailer');
    var hoursSchema     = require('../models/hours.js');
    var menuSchema      = require('../models/tag.js');
    var itemSchema      = require('../models/item.js');
    var eventsSchema    = require('../models/events.js');
    var specialsSchema  = require('../models/specials.js');
    var messageSchema   = require('../models/message.js');
    var applicantSchema = require('../models/applicant.js');
    var editSchema      = require('../models/edit.js');
    var partySchema     = require('../models/party.js');
    var flash           = require('connect-flash');
    var https           = require('https');
    var Dropbox         = require('dropbox');
    var validator       = require('validator');
    var path            = require('path');
    var mg              = require('nodemailer-mailgun-transport');

    const GLOBAL_CLIENT_ID = "598a62acf36d286bd490bccd";

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



    router.get("/menuSection/:id", function(req, res) {
      menuSchema.find({id: req.params.id, clientID: GLOBAL_CLIENT_ID},{}, function(err, menus) {
        if (err || menus.length == 0) {
          console.log(err);
          res.end();
        } else {
          menus[0] = JSON.parse(JSON.stringify(menus[0]));
          itemSchema.find({clientID: GLOBAL_CLIENT_ID},{}, function(err, items) {
            if (err) {
              console.log(err);
              res.end();
            } else {
              items = JSON.parse(JSON.stringify(items));
              var formattedMenuData = {
                header_title: menus[0].name,
                header_img: menus[0].header_img,
                subsections: []
              }
              for (var i = 0; i < menus[0].submenus.length; ++i) {
                formattedMenuData.subsections.push({title: menus[0].submenus[i], items: []});
              }
              for (var i = 0; i < formattedMenuData.subsections.length; ++i) {
                for (var j = 0; j < items.length; ++j) {
                  for (var k = 0; k < items[j].tags.length; ++k) {
                    // console.log(items[j].subsection, formattedMenuData.subsections[i].title);
                    if (items[j].tags[k] == menus[0].name && items[j].subsection == formattedMenuData.subsections[i].title) {
                      formattedMenuData.subsections[i].items.push(items[j]);
                    }
                  }
                }
              }
              res.send({success: true, data: formattedMenuData});
            }
          });
        }
      });
    });

    router.get('/getMenus', function(req, res) {
      menuSchema.find({clientID: GLOBAL_CLIENT_ID},{}, function(err, menus) {
        if (err) console.log(err);
        else res.send(menus);
      });
    });

    router.get("/getUser", function(req, res) {
      if (req.user) res.send({"success": true, user: {name: req.user.name, admin: req.user.admin}});
      else res.send({"success": false, "err": "500"});
    });

    router.get('/getParties', function(req, res) {
      partySchema.find({},{}, function(err, menus) {
        if (err) console.log(err);
        else res.send(menus);
      });
    });

    router.get('/getLogs', function(req, res) {
      editSchema.find({},{}, function(err, logs) {
        if (err) console.log(err);
        else res.send(logs);
      });
    });

    router.get('/getItems', function(req, res) {
      itemSchema.find({},{}, function(err, items) {
        if (err) console.log(err);
        else res.send(items);
      });
    });

    router.get('/getFBID', function(req, res) {
      res.send(process.env.fbid);
    });

    var logEdit = function(author,desc,edited_items) {
      author = author || "unknown";
      edited_items = edited_items || [];
      var edit = new editSchema({
        author: author.name || "none",
        author_id: author._id,
        description: desc,
        date_time: new Date(),
        edited_items: edited_items
      });
      edit.save();
      console.log("------- edit logged --------");
    }

    var LocalStrategy = require('passport-local').Strategy;
    require('../passport/config.js')(passport);
    router.post('/register', function(req, res, next) {
        passport.authenticate('register', function(err, newUser, info) {
          if (err) return next(err);
          if (!newUser) res.send({success: false});
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
          res.send({success: false});
        }
        req.login(user, loginErr => {
            if(loginErr) {
                return next(loginErr);
            }
            res.send({success: true});
        });
      })(req, res, next);
    });

    var isLoggedIn = function(req, res, next) {
      console.log("checking login");
      if (req.isAuthenticated()) {
        console.log("logged in");
        res.send({loggedIn: true});
      } else {
        res.send({loggedIn: false});
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

    router.get('/getMenus', function(req, res) {
      menuSchema.find({}, {}, {sort: {"start": -1}}, function(err, events) {
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
        if (err) res.send({success: false, err: err});
        else res.send({success: true});
      });
      var message = (req.body.title == "Untitled (New)") ? "added a new event" : "duplicated an event";
      logEdit(req.user,message,[req.body]);
    });

    router.post('/addParty', function(req, res, next) {
      var party = new partySchema({
          title: req.body.title
      });
      party.save(function(err, ev) {
        if (err) res.send({success: false, err: err});
        else res.send({success: true});
      });
      logEdit(req.user,"added a new party",[req.body]);
    });

    router.post('/addItem', function(req, res, next) {
      var item = new itemSchema({
          title: req.body.title,
          desc: req.body.desc,
          price: req.body.price,
          tags: req.body.tags,
          availabilities: req.body.availabilities
      });
      item.save(function(err, item) {
        if (err) res.send({success: false, err: err});
        else res.send({success: true, item: item});
      });
      logEdit(req.user,"added a new menu item", [item]);
    });

    router.post('/editEvent', function(req, res, next) {
      eventsSchema.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: true}, function(err, doc) {
          if (err) res.send({success: false, err: err});
          else res.send({success: true});
          logEdit(req.user,"edited an event", [req.body]);
      });
    });

    router.post('/editParty', function(req, res, next) {
      partySchema.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: true}, function(err, doc) {
          if (err) res.send({success: false, err: err});
          else res.send({success: true});
          logEdit(req.user,"edited a party", [req.body]);
      });
    });

    router.post('/editItem', function(req, res, next) {
      itemSchema.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: true, new: true}, function(err, doc) {
          if (err) res.send({success: false, err: err});
          else res.send({success: true, item: doc});
          logEdit(req.user,"edited a menu item", [req.body]);
      });
    });

    router.post('/deleteEvent', function(req, res, next) {
      eventsSchema.find({_id: req.body._id}).remove(function(err, data) {
        if (err) {
          console.log(err);
          res.send({success: false, err: err});
        }
        else res.send({success: true});
        logEdit(req.user,"deleted an event", [req.body]);
      });
    });

    router.post('/deleteParty', function(req, res, next) {
      partySchema.find({_id: req.body._id}).remove(function(err, data) {
        if (err) {
          console.log(err);
          res.send({success: false, err: err});
        }
        else res.send({success: true});
        logEdit(req.user, "deleted a party", [req.body]);
      });
    });

    router.post('/deleteMenuItem', function(req, res, next) {
      itemSchema.find({_id: req.body._id}).remove(function(err, data) {
        if (err) {
          console.log(err);
          res.send({success: false, err: err});
        }
        else res.send({success: true, item: {_id: req.body._id}});
        logEdit(req.user,"deleted a menu item", [req.body]);
      });
    });

    router.get('/deleteWithTag/:tag', function(req, res, next) {
      itemSchema.find({tags: [req.params.tag]}).remove(function(err, data) {
        if (err) {
          console.log(err);
          res.send({success: false, err: err});
        }
        else res.send({success: true});
      });
    });

    router.get('/featuredEvents', function(req, res) {
      eventsSchema.find({featured: true},{},{sort: {"start": -1}}, function(err, events) {
        if (err) {console.log(err); res.send({success: false, err: err});}
        else res.send({success: true, events: events});
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
            res.send({success: false, err: err});
         } else {
            console.log(info);
            res.send({success: true});
         }
      });
    });

    router.post('/applyToWork', function(req, res, next) {
      var auth = {
        auth: {
          api_key: process.env.api_key,
          domain: process.env.domain
        }
      }
      var data = req.body;
      if (!data.message) data.message = "Not given";
      var smtpTransporter = nodemailer.createTransport(mg(auth));
      var message = {
        from: 'fiddlersonmain@gmail.com',
        to: 'fiddlersonmain@gmail.com',
        subject: 'Job Application: ' + data.first_name + " " + data.last_name,
        text: "Name: " + data.first_name + " " + data.last_name + "\nEmail: " + data.email + "\nPhone Number: " + data.phnum + "\nDesired Position: " + data.position + "\nMessage: " + data.message
      };

      smtpTransporter.sendMail(message, function(err, info) {
         if (err) {
            console.log(err);
            res.send({success: false, err: err});
         } else {
            console.log(info);
            res.send({success: true});
         }
      });

      var applicant = new applicantSchema(data);
      applicant.save();
    });

    // /* GET logout page */
    // router.get('/logout', function(req, res, next) {
    //   req.logout();
    //   res.redirect('/');
    // });

    return router;
}
