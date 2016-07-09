var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
      title: 'The Harp and Fiddle',
      links: ["Menu", "About", "Contact", "Parties", "Gallery"],
      homepageslides: ["/images/wooden.jpg","",""]
  });
});

module.exports = router;
