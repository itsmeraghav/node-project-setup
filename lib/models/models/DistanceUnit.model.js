
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var DistanceUnitSchema = new Schema({

    set_distance_unit:{
        type:String,
        enum:["Select_Unit","KM","Miles"]
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