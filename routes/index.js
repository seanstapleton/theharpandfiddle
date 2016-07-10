var express = require('express');
var router = express.Router();

var layoutData = { 
      title: 'The Harp and Fiddle',
      links: ["menu", "events", "contact", "parties", "gallery"],
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

module.exports = router;
