

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var CartCheckoutSchema = new Schema({
  date:{
    type:Date,
    required:true,
  },
  full_name:{
    type:String,
    required:true
  },
  zipcode:{
    type:Number,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  country: { 
     type:String,
    required:true
   },
  state: { 
    type:String,
    required:true
   },
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AddCart' },
 

  status: {
    type: Number,
    default: 1
  },
  is_edit: {
    type: Number,
    default: 1
  },
  is_deleted: {
    type: Number,
    default: 0,
},

}, {timestamps: true,collection: 'CartCheckout'});

CartCheckoutSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("CartCheckout", CartCheckoutSchema);