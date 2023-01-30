
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var MyPhotosSchema = new Schema({
  image:{
    type:String,
    required:true,
    default:""
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
}, {timestamps: true,collection: 'MyPhotos'});

MyPhotosSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("MyPhotos", MyPhotosSchema);