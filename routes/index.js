module.exports = function(db) {
    var express = require('express');
    var router = express.Router();
    var db = require('../db');
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
        specialsSchema.find({dotw: days[d.getDay()]}, {'_id': false}, function(err, specials) {
            res.render('index', {
                title: 'The Harp and Fiddle',
                homepageslides: ["/images/wooden.jpg","",""],
                hours: hours,
                specials: specials
            });
        });
    });
    
    /* GET dinner menu page. */
    router.get('/menu', function(req, res, next) {
        menuSchema.findOne({"type": "Dinner Menu"}, {'_id': false}, function(err, menu) {
            res.render('menu', {
                title: 'The Harp and Fiddle - Dinner Menu',
                hours: hours,
                menu: JSON.stringify(menu)
            });
        });
    });

    /* GET events page. */
    router.get('/events', function(req, res, next) {
        eventsSchema.find({}, {_id: false}, function(err, events) {
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
          title: 'The Harp and Fiddle - Events',
          hours: hours
      });
    });

    /* GET about page. */
    router.get('/gallery', function(req, res, next) {
      res.render('gallery', { 
          title: 'The Harp and Fiddle - Gallery',
          hours: hours,
          albums: [
              {
                  title: "Food & Drink",
                  path: 'FoodDrink',
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
