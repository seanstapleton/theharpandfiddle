var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventsSchema = new Schema({
    title: String,
    start: String,
    end: String,
    description: String,
    date: String,
    url: String,
    img: String,
    featured: Boolean
});

module.exports = mongoose.model('Event', eventsSchema);
