
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var DistanceUnitSchema = new Schema({

  distance_unit: {
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
 
}, {timestamps: true,collection: 'DistanceUnit'});

DistanceUnitSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("DistanceUnit", DistanceUnitSchema);