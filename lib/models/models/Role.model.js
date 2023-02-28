"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    level: {
      type: Number,
      required: true,
      default: 10,
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
  { timestamps: true, collection: "Roles" }
);

RoleSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("Role", RoleSchema);
