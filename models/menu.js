var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    id: String,
    icon_path: String,
    src: String
})

module.exports = mongoose.model('Menu', menuSchema);
