var mongoose = require('mongoose');

var url = 'mongodb://'+process.env.db_user+':'+process.env.db_pass+'@ds021994.mlab.com:21994/theharpandfiddle';
mongoose.connect(url);

module.exports = mongoose.connection;
