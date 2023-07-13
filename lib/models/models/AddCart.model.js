var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var AddCartSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cart_item: [
      {
        dish_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dishes",
        },
        grocery_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    is_edit: {
      type: Number,
      default: 1,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true, collection: "AddCart" }
);

AddCartSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("AddCart", AddCartSchema);
