const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  bcrypt = require("bcrypt");

const AdminSettingSchema = new Schema(
  {
    iosForceUpdate: {
      type: Boolean,
      default: false,
    },

    iosAppVersion: {
      type: Number,
      default: 1,
    },
    maintenance: {
      type: Boolean,
      default: false,
    },

    is_launch: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
    id: false,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  }
);

module.exports = mongoose.model("AdminSetting", AdminSettingSchema);
