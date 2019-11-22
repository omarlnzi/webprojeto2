const mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  posts: [{
    imgurl:{
      type: String
    },
    text:{
      type: String
    }
  }]

});
const User = mongoose.model('User', UserSchema);
module.exports = User;