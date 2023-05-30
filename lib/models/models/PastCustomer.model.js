
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var PastCustomerSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      following:{
        type:String,
        default:false,
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
    collection: 'PastCustomer'
  }
  );

PastCustomerSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("PastCustomer", PastCustomerSchema);