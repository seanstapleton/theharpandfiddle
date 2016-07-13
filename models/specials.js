var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var specialsSchema = new Schema({
    title: String,
    description: String,
    dotw: String
});

module.exports = mongoose.model('Special', specialsSchema);