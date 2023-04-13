
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require('slug')
var uniqueValidator = require("mongoose-unique-validator");
var CuisinesSchema = new Schema(
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
            default: 1,
        },

        //Cuisiness name list=0
        //spice level list=1
        //veg type list=2
        //Cuisines type list =3
        //Dish Speciality =4
        //Sample Intervel =5
        //Discount =6
        //Cuisines=7

        is_edit: {
            type: Number,
            default: 1,
        },
        is_deleted: {
            type: Number,
            default: 0,
        },

       
    },
    { timestamps: true, collection: "Cuisiness" }
);

CuisinesSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("Cuisines", CuisinesSchema);
