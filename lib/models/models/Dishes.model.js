var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var DishesSchema = new Schema(
  {
    dish_photo: {
      type: String,
      //  required:true,
    },
    dish_title: {
      type: String,
    },

    description: {
      type: String,
    },
    cuisine_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },

    ingredients: {
      type: String,
    },

    tags: [{
      type: String,
  }],

    preparation_time: {
      type: String,
    },
    spice_level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },

    food_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },
    cost: {
      type: Number,
    },

    sample_interval: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },
    free_sample_limit: {
      type: Number,
    },

    weekly_speciality: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    }],

    today_speciality: {
      type: Date,
    },

    discount_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterTable",
    },

    discount_amount: {
      type: Number,
    },

    isDeleted: {
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

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "Dishes" }
);

DishesSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("Dishes", DishesSchema);
