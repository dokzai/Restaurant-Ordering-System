const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  privacy: { type: Boolean, required: true },
  orders: [{
    type: String
  }],  
});

const User = mongoose.model("User", userSchema); 
module.exports = User;
