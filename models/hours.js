const mongoose = require('mongoose');

const { Schema } = mongoose;
const hoursSchema = new Schema({
  day: String,
  timeframe: String,
  order: Number,
});

module.exports = mongoose.model('Hour', hoursSchema);
