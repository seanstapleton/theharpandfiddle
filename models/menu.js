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
    sections: {
        appetizers: {
            available: Boolean,
            title: String,
            order: Number,
            items: [itemSchema]
        },
        salads: {
            available: Boolean,
            title: String,
            order: Number,
            items: [itemSchema]
        },
        sandwiches: {
            available: Boolean,
            title: String,
            order: Number,
            items: [itemSchema]
        },
        entrees: {
            available: Boolean,
            title: String,
            order: Number,
            items: [itemSchema]
        },
        specialties: {
            available: Boolean,
            title: String,
            order: Number,
            items: [itemSchema]
        },
        desserts: {
            available: Boolean,
            title: String,
            order: Number,
            items: [itemSchema]
        }
    }
})

module.exports = mongoose.model('Menu', menuSchema);