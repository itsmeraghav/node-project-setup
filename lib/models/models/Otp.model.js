const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  bcrypt = require("bcrypt");

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    mobile_number: {
      type: Number,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    iosAppVersion: {
      type: Number,
      default: 1,
    },
    otp: {
      type: Number,
    },
    otpType: {
      type: String,
      trim: true,
      lowercase: true,
    },
    otpTokenIssuedAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
    collection: "Otps",
    id: false,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  }
);

module.exports = mongoose.model("Otp", OtpSchema);
