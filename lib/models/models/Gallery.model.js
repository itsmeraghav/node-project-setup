
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var GallerySchema = new Schema({
  image:{
    type:String,
    required:true,
    default:""
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


}, {timestamps: true,collection: 'Gallery'});

GallerySchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("Gallery", GallerySchema);