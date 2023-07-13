var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var GrocerySchema = new Schema(
  {
    grocery_photo: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    //648059c208e63926d44e2556
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },
    //brand:"64805a0a08e63926d44e256a"

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },
    price_per_item: {
      type: Number,
      default: 0,
    },
    //unit:"64afa3950047c0252c8ee704"
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },
    price_of_minimum_quantity: {
      type: Number,
      default: 0,
    },

    provided_quantity: {
      type: Number,
      default: 0,
    },

    //646b396aa39d470eac407bd9
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },
    discount_amount: {
      type: Number,
      default: 0,
    },

    total_amount: {
      type: Number,
    },
    total_amount_after_discount: {
      type: Number,
    },
    marchent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  },
  { timestamps: true, collection: "Grocery" }
);

GrocerySchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("Grocery", GrocerySchema);
