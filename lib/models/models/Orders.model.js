
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const { PENDING } = require('../enums/RequestStatus.enum');
 var OrdersSchema = new Schema({
    order_id:{
        type:String,
        required:true
     },
    order_date:{
         type:Date,
         required:true
     },
    cx_name:{
        type:String,
        required:true,
    },
    order_amount:{
        type:Number,
        required:true
    },
    cx_address:{
        type:String,
        required:true
    },
    // 0=order PENDING
    // 1=oredrconfirm
    // 2= process
    // 3= deliverd
    // 4=cancel
    order_status: {
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
    cx_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    marchent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
      },
  
  
}, {timestamps: true,collection: 'Orders'});

OrdersSchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("Orders",OrdersSchema);