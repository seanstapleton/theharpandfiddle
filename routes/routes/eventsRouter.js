const express = require('express');

const { findClientEvents } = require('../controllers/events');

const GLOBAL_CLIENT_ID = process.env.clientID;
const eventsRouter = express.Router();

eventsRouter.get('/', (req, res) =>
  findClientEvents(GLOBAL_CLIENT_ID)
    .then(events => res.send({ success: true, data: events }))
    .catch(err => res.send({ success: false, err })));

eventsRouter.get('/featured', (req, res) =>
  findClientEvents(GLOBAL_CLIENT_ID, { featured: true })
    .then(events => res.send({ success: true, data: events }))
    .catch(err => res.send({ success: false, err })));

module.exports = eventsRouter;
