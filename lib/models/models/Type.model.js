
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require('slug')
var uniqueValidator = require("mongoose-unique-validator");
var TypeSchema = new Schema(
    {
        name: {
            type: String,
            required:true
        },

        slug: {
            type: String,
            required:true
        },

        status: {
            type: String,
            default: 1,
        },


        //Types name list=0
        //spice level list=1
        //veg type list=2
        //Type type list =3
        //Dish Speciality =4
        //Sample Intervel =5
        //Discount =6
        //Type=7

        is_edit: {
            type: Number,
            default: 1,
        },
        is_deleted: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, collection: "Types" }
);

TypeSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("Type", TypeSchema);
