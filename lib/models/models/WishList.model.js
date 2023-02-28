
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var WishListSchema = new Schema({
name:{
    type:String,
    required:true
},

item_name:{
    type:String,
    required:true
},
 
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
 
}, {timestamps: true,collection: 'WishList'});

WishListSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("WishList", WishListSchema);