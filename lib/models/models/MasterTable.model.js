
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require('slug')
var uniqueValidator = require("mongoose-unique-validator");
var MasterTableSchema = new Schema(
    {
        title: {
            type: String,
        },

        slug: {
            type: String,

        },
        status: {
            type: Number,
            default: 1,
        },

        type: {
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

        created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true, collection: "MasterTables" }
);

MasterTableSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("MasterTable", MasterTableSchema);
