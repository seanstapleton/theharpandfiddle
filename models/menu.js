var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    id: String,
    icon_path: String,
    src: String,
    items: Array
})

module.exports = mongoose.model('Menu', menuSchema);
