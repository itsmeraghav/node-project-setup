var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var EventOrdersSchema = new Schema(
  {
    event_title: {
      type: String,
      required: true,
    },
    expectations: {
      type: String,
    },

    guests: {
      type: Number,
    },
    budget: {
      type: Number,
    },
    cuisine_types: { type: mongoose.Schema.Types.ObjectId, ref: "MasterTable" },

    food_time: [
      {
        type: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MasterTable",
        },
        description: {
          type: String,
        },
      },
    ],
    beverages: [
      {
        type: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MasterTable",
        },
        description: {
          type: String,
        },
      },
    ],
    event_start_date: {
      type: Date,
    },
    event_end_date: {
      type: Date,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chef_hire: [
      {
        chef_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        invite: {
          type: Number,
          default: 0,
        },
        message: {
          type: String,
          default: "",
        },
      },
    ],

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
  { timestamps: true, collection: "EventOrders" }
);

EventOrdersSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("EventOrders", EventOrdersSchema);
