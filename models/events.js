var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventsSchema = new Schema({
    title: String,
    start: String,
    description: String,
    date: String,
    url: String
});

module.exports = mongoose.model('Event', eventsSchema);