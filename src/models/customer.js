const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  age: {type: Number, required: true, min: 0},
  address: {type: String, required: true, trim: true},
  membership: {type: String, required: false, trim: true}
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
