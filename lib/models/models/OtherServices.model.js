
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var OtherServicesSchema = new Schema({
  service_name:{
    type:String,
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
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true,collection: 'OtherServices'});

OtherServicesSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("OtherServices", OtherServicesSchema);