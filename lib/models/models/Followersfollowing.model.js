var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var FollowersfollowingSchema = new Schema(
  {
    from_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    to_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    massages: [],

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
  { timestamps: true, collection: "Followersfollowing" }
);

FollowersfollowingSchema.plugin(uniqueValidator, {
  message: "is already taken.",
});

module.exports = mongoose.model("Followersfollowing", FollowersfollowingSchema);
