
const { required } = require('joi/lib/types/date');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var LiveFeedSchema = new Schema({
  dish_image:{
    type:String,
    required:true,
    default:""
  },
  dish_name:{
    type:String,
    required: true,
  },
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 chef_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  dish_cost:{
    type:Number,
    required: true,
  },

  like:[{
    type:String,
    default:"0"
  }],

  comment:[{
    type:String,
    default:""
  }],
  
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


}, {timestamps: true,collection: 'LiveFeeds'});

LiveFeedSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("LiveFeed", LiveFeedSchema);