const { required } = require("joi/lib/types/date");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var LiveFeedSchema = new Schema(
  {
    dish_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dishes",
      required: true,
    },

    chef_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    describtion: {
      type: String,
      default: null,
    },

    likes: [
      {
        like_status: {
          type: Boolean,
          default: false,
        },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    comments: [
      {
        massage: {
          type: String,
          default: "",
        },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        massage_deleted: {
          type: Number,
          default: 0,
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
  { timestamps: true, collection: "LiveFeeds" }
);

LiveFeedSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("LiveFeed", LiveFeedSchema);
