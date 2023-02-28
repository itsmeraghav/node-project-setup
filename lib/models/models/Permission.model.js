"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var PermissionSchema = new Schema(
  {
    permission: [
      {
        title: {
          type: String,
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
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
  },
  { timestamps: true, collection: "Permission" }
);

PermissionSchema.plugin(uniqueValidator, {
  message: "is already taken.",
});
// module.exports =

module.exports = mongoose.model("Permission", PermissionSchema);
