var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var ExtraServicesSchema = new Schema(
  {
    plan_creater_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan_amount: {
      type: String,
    },

    plan_duration: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment_status: {
      type: Boolean,
      default: false,
    },
    auto_renewal: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Number,
      default: 1,
    },
    is_edit: {
      type: Number,
      default: 1,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "ExtraServices" }
);

ExtraServicesSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("ExtraServices", ExtraServicesSchema);
