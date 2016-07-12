var express = require('express');
var router = express.Router();

var layoutData = { 
      title: 'The Harp and Fiddle',
      links: ["menu", "events", "contact", "gallery"],
      homepageslides: ["/images/wooden.jpg","",""]
  }

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', layoutData);
});

/* GET about page. */
router.get('/events', function(req, res, next) {
  res.render('events', layoutData);
});

/* GET about page. */
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
              cover: 'drinks.jpg',
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

module.exports = router;
