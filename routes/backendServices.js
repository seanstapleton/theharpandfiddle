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
    var https           = require('https');
    var Dropbox         = require('dropbox');
    var validator       = require('validator');

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

    // /* GET logout page */
    // router.get('/logout', function(req, res, next) {
    //   req.logout();
    //   res.redirect('/');
    // });

    return router;
}
