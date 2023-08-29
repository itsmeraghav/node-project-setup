var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var FavouriteDishSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dish_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dishes",
      required: true,
    },

    request_approve: {
      type: Number,
      default: 0,
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
  { timestamps: true, collection: "FavouriteDish" }
);

FavouriteDishSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("FavouriteDish", FavouriteDishSchema);
