var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var MembershipSchema = new Schema(
  {
    name: {
      type: String,
      reuired: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    duration: {
      type: Date,
    },
    features: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Features",
      default: [],
    },

    singup_features: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Features",
      default: [],
    },

    price: {
      type: Number,
      default: 0,
    },
    bidding: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      default: 0,
    },

    featured_membership: {
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
  { timestamps: true, collection: "Membership" }
);

MembershipSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("Membership", MembershipSchema);
