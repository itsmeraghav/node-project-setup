
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var AvailabilitySchema = new Schema({
  availability:[{
  start:{
    type:String
  },
  end:{
    type:String,
  },
  weekly_speciality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterTable",
  },
}],


  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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


}, {timestamps: true,collection: 'Availability'});

AvailabilitySchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("Availability", AvailabilitySchema);