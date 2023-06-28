
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var FeedbackSchema = new Schema({
 from_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  to_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dishes",
  
  },

  date:{
    type:Date,
  },
  description:{
    type:String,
  },
  rating:{
    type:Number,
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
 
},
  {timestamps: true,
    collection: 'Feedback'
  }
  );

FeedbackSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("Feedback", FeedbackSchema);