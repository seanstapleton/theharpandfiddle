const express = require('express');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const https = require('https');

const router = express.Router();

const menusRouter = require('./routes/menusRouter');
const eventsRouter = require('./routes/eventsRouter');

module.exports = (db, passport) => {
  require('../passport/config.js')(passport); // eslint-disable-line global-require

  router.post('/insta', (req, response) => {
    const apiRoute = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${process.env.igaccess}`;
    https.get(apiRoute, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          response.send(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(e);
    });
  });

  router.use('/menus', menusRouter);
  router.use('/events', eventsRouter);

  router.get('/fbid', (req, res) => {
    res.send(process.env.fbid);
  });

  router.post('/sendMessage', (req, res) => {
    const auth = {
      auth: {
        api_key: process.env.api_key,
        domain: process.env.domain,
      },
    };
    const data = req.body;
    const smtpTransporter = nodemailer.createTransport(mg(auth));
    const message = {
      from: 'fiddlersonmain@gmail.com',
      to: 'fiddlersonmain@gmail.com',
      subject: `Contact Form: ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone Number: ${data.phone}\n`
        + `Subject: ${data.subject}\nMessage: ${data.message}`,
    };

    smtpTransporter.sendMail(message, (err) => {
      if (err) {
        res.send({ success: false, err });
      } else {
        res.send({ success: true });
      }
    });
  });

  return router;
};
