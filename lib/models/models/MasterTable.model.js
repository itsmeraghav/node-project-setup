
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require('slug')
var uniqueValidator = require("mongoose-unique-validator");
var MasterTableSchema = new Schema(
    {
        title: {
            type: String,
            required:true
        },

        slug: {
            type: String,
            required:true
        },

        status: {
            type: Number,
            default: 1,
        },

        
        type: {
            type: Number,
           required:true
        },

        //cuisines name list=0
        //spice level list=1
        //veg type list=2
        //cuisine type list =3
        //Dish Speciality =4
        //Sample Intervel =5
        //Discount =6
        //cuisine=7

        is_edit: {
            type: Number,
            default: 1,
        },
        is_deleted: {
            type: Number,
            default: 0,
        },

       
    },
    { timestamps: true, collection: "MasterTables" }
);

MasterTableSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("MasterTable", MasterTableSchema);
