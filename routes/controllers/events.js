const _ = require('lodash');

const EventsSchema = require('../../models/event');

const findClientEvents = (clientID, queryParams) => new Promise(
  (resolve, reject) => {
    let searchQuery = { clientID };
    if (queryParams) searchQuery = _.merge(searchQuery, queryParams);
    EventsSchema.find(searchQuery, {}, { sort: { start: -1 } }, (err, events) => {
      if (err) {
        return reject(err);
      }
      return resolve(events);
    });
  },
);

module.exports = { findClientEvents };
