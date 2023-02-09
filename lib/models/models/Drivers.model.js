
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var DriversSchema = new Schema({
 
    enter_zipcode:{
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
 
}, {timestamps: true,collection: 'Drivers'});

DriversSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("Drivers", DriversSchema);