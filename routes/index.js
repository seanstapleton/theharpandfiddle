module.exports = function(db) {
    var express = require('express');
    var router = express.Router();
    var db = require('../db');
    var hoursSchema = require('../models/hours.js');
    var menuSchema = require('../models/menu.js');

    var layoutData = { 
      title: 'The Harp and Fiddle',
      links: ["menu", "events", "contact", "gallery"],
      homepageslides: ["/images/wooden.jpg","",""],
    }
    
    var hours;
    
    hoursSchema.find({}, {'_id': false, 'order': false}, function(err, returnHours) {
        hours = returnHours;
    });

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'The Harp and Fiddle',
            homepageslides: ["/images/wooden.jpg","",""],
            hours: hours
        });
    });
    
    /* GET dinner menu page. */
    router.get('/menu', function(req, res, next) {
        menuSchema.findOne({"type": "Dinner Menu"}, {'_id': false}, function(err, menu) {
            res.render('menu', {
                title: 'The Harp and Fiddle - Dinner Menu',
                hours: hours,
                menu: menu
            });
        });
    });

    /* GET events page. */
    router.get('/events', function(req, res, next) {
      res.render('events', layoutData);
    });

    /* GET contact page. */
    router.get('/contact', function(req, res, next) {
      res.render('contact', layoutData);
    });

    /* GET about page. */
    router.get('/gallery', function(req, res, next) {
      res.render('gallery', { 
          title: 'The Harp and Fiddle',
          links: ["menu", "events", "contact", "gallery"],
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
