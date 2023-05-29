var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var GrocerySchema = new Schema(
  {
    list_title: {
      type: String,
      required: true,
    },

    included_items: [
      {
        description: {
          type: String,
        },

        item: {
          type: String,
        },

        minimum_quantity: {
          type: Number,
          
        },
        price_of_minimum_quantity:{
            type:Number,

        },

        unit: {
          type: String,
          enum: ["Kilogram", "Grams", "Litres", "Pieces"],
        },

        quantity: {
          type: Number,
        
        },

        item_photo: {
          type: String,
          default: "",
        },
        total: {
          type: Number,
          
        },
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    grocery_photos: {
      type: String,
      default: "",
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
