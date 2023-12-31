var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
// const { PENDING } = require('../enums/RequestStatus.enum');
var OrdersSchema = new Schema(
  {
    order_id: {
      type: String,
      required: true,
    },

    cartcheckout_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartCheckout",
      required: true,
    },

    payment: {
      amount: {
        type: Number,
      },
      payment_status: {
        type: Boolean,
      },
      payment_response: {},
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

    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // 0=order PENDING
    // 1=marchent request to driver
    // 2= driver request accept
    //3= driver deniled to delvery
    //4= order deliver via driver
    driver_status: {
      type: Number,
      default: 0,
    },

    is_edit: {
      type: Number,
      default: 1,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: "Orders" }
);

OrdersSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("Orders", OrdersSchema);
