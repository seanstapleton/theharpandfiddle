var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    name: String,
    time: String,
    email: String,
    phnum: String,
    subject: String,
    message: String
});

module.exports = mongoose.model('Message', messageSchema);
