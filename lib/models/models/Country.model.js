
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var CountrySchema = new Schema({
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
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true,collection: 'Country'});

CountrySchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("Country", CountrySchema);