'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var EthnicitySchema = new Schema({
  name:{
    type: String,
     required: true,
      unique: true
    }, 
  slug: {
    type: String,
     required: true,
      unique: true
    }, 
  status: {
    type: Number,
    default: 1
  },
  is_edit: {
    type: Number,
    default: 1
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true,collection: 'Ethnicity'});

EthnicitySchema.plugin(uniqueValidator, { message: 'is already taken.' });
// module.exports =
 mongoose.model('Ethnicity', EthnicitySchema);
