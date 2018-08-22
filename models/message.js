const mongoose = require('mongoose');

const { Schema } = mongoose;
const messageSchema = new Schema({
  name: String,
  time: String,
  email: String,
  phnum: String,
  subject: String,
  message: String,
});

module.exports = mongoose.model('Message', messageSchema);
