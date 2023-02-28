"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var DefaultPermissionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    is_allow: {
      type: Boolean,
      default: true,
    },
    add: {
      type: Boolean,
      default: true,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    delete: {
      type: Boolean,
      default: true,
    },
    view: {
      type: Boolean,
      default: true,
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
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "DefaultPermissions" }
);

DefaultPermissionSchema.plugin(uniqueValidator, {
  message: "is already taken.",
});
// module.exports =

module.exports = mongoose.model("DefaultPermission", DefaultPermissionSchema);
