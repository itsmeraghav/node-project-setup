var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
// const { PENDING } = require('../enums/RequestStatus.enum');
var CookNshopSchema = new Schema(
  {
    order_grocery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grocery",
        required: true,
      },
    ],
    order_amount: {
      type: Number,
      required: true,
    },

    cx_address: {
      type: String,
      required: true,
    },
    // 0=order PENDING
    // 1=oredrconfirm
    // 2= process
    // 3= deliverd
    // 4=cancel
    order_status: {
      type: Number,
      default: 0,
    },
    cx_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    marchent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //   total_item_amount:{
    //     type:Number,
    //     required:true
    //   },

    //   site_charge:{
    //     type:Number,
    //     required:true
    //   },

    //   custom_dish_sub_total: {
    //     type:Number,
    //     required:true
    //   },

    // dish_sub_total: {
    //     type:Number,
    //     required:true
    //   },

    //   grand_total: {
    //     type:Number,
    //     required:true
    //   },

    is_edit: {
      type: Number,
      default: 1,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: "CookNshop" }
);

CookNshopSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("CookNshop", CookNshopSchema);
