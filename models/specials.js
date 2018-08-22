const mongoose = require('mongoose');

const { Schema } = mongoose;
const specialsSchema = new Schema({
  title: String,
  description: String,
  dotw: String,
});

module.exports = mongoose.model('Special', specialsSchema);
