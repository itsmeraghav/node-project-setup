
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var OtherServicesSchema = new Schema({
 years_of_experience:{
  type:Number,
 },
 outcall_service:{
  type:Number,
 },
 incall_service:{
  type:Number,
 },
 description:{
  type:String,
 },
 other_service_offered: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "MasterTable",
},
user_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
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