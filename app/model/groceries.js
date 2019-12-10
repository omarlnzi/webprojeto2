const mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true
  },
  qtde: {
    type: String,
    required: true,
    trim: true
  },
});
const Groceries = mongoose.model('Groceries', UserSchema);
module.exports = Groceries;