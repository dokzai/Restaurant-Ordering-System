const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = Schema({
  user_who_ordered: {type: String, required: true},
  restaurantID: { type: Number, required: true},
  restaurantName: { type: String, required: true },
  subtotal: { type: Number, required: true },
  total: {type:Number, required:true}, 
  fee: {type:Number, required:true}, 
  tax: {type:Number, required:true}, 
  order: {},
 
});

const Order = mongoose.model("Order", orderSchema); //* -> create a collection "movies"
module.exports = Order;
