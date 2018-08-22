const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const usersSchema = new Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

usersSchema.methods.generateHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

usersSchema.methods.validPassword = password =>
  bcrypt.compareSync(password, this.password);

module.exports = mongoose.model('User', usersSchema);
