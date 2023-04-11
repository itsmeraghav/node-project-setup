
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var StateSchema = new Schema({
  name:{
    type:String,
    required:true,
  },

  
  slug:{
    type:String,
    unique:true,
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
 
}, {timestamps: true,collection: 'State'});

StateSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("State", StateSchema);