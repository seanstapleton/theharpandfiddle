var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    title: String,
    src: String
})

module.exports = mongoose.model('Menu', menuSchema);
