
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var RequestSampleSchema = new Schema({
  note:{
    type:String,
    required:true,
  },
  cx_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dishes' },

  status: {
    type: Number,
    default: 0
  },
  is_edit: {
    type: Number,
    default: 1
  },
  is_deleted: {
    type: Number,
    default: 0,
},

}, {timestamps: true,collection: 'RequestSample'});

RequestSampleSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("RequestSample", RequestSampleSchema);