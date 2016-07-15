var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    alc: Number
});

var menuSchema = new Schema({
    type: String,
    sub: String,
    sections: [
        {
            section: String,
            col: Number,
            available: Boolean,
            title: String,
            order: Number,
            items: [itemSchema]
        }
    ]
})

module.exports = mongoose.model('Menu', menuSchema);