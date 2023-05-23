
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var FeedbackSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date:{
    type:Date,
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