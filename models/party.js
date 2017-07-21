var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var partySchema = new Schema({
    title: String,
    booked_by: String,
    booking_date: String,
    host_name: String,
    host_phone: String,
    host_email: String,
    event_info: {
      description: String,
      date: String,
      location: String,
      num_guests: {
        adults: Number,
        kids: Number
      }
    },
    drinks: {
      package_type: String,
      unit_price: Number,
      payment_method: String,
      other: String
    },
    food: {
      package_type: String,
      serving_type: String,
      price: {
        tax_included: Boolean,
        tip_included: Boolean,
        adult: Number,
        kid: Number
      },
      payment: String,
      food_selections: Array
    },
    linensOnTables: Boolean,
    special_instructions: String,
    admin_info: {
      initial_request: String,
      deposit_amt: Number,
      yelp: Boolean,
      party_size_confirmation: {
        size: Number,
        date: String,
        admin: String
      },
      food_selections_confirmation: {
        selections: Array,
        date: String,
        admin: String
      }
    }
});

module.exports = mongoose.model('partie', partySchema);
