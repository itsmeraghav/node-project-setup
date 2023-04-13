
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require('slug')
var uniqueValidator = require("mongoose-unique-validator");
var SpiceLevelSchema = new Schema(
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

        
        type: {
            type: Number,
            default: 2,
        },

        //SpiceLevels name list=0
        //spice level list=1
        //veg type list=2
        //SpiceLevel type list =3
        //Dish Speciality =4
        //Sample Intervel =5
        //Discount =6
        //SpiceLevel=7

        is_edit: {
            type: Number,
            default: 1,
        },
        is_deleted: {
            type: Number,
            default: 0,
        },

       
    },
    { timestamps: true, collection: "SpiceLevels" }
);

SpiceLevelSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("SpiceLevel", SpiceLevelSchema);
