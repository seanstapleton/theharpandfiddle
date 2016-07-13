var mongoose = require('mongoose');

var url = 'mongodb://owner:root@ds021994.mlab.com:21994/theharpandfiddle';
mongoose.connect(url);

module.exports = mongoose.connection;
