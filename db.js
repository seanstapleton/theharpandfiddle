var mongoose = require('mongoose');
var config = require('./config.example');

var url = 'mongodb://'+config.db.user+':'+config.db.pass+'@ds021994.mlab.com:21994/theharpandfiddle';
mongoose.connect(url);

module.exports = mongoose.connection;
