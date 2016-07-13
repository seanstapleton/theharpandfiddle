var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hoursSchema = new Schema({
    day: String,
    timeframe: String,
    order: Number
});

module.exports = mongoose.model('Hour', hoursSchema);