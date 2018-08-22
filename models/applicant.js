const mongoose = require('mongoose');

const { Schema } = mongoose;
const applicantSchema = new Schema({
  first_name: String,
  last_name: String,
  phnum: String,
  email: String,
  position: String,
  message: String,
});

module.exports = mongoose.model('Applicant', applicantSchema);
