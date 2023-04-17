
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require('slug')
var uniqueValidator = require("mongoose-unique-validator");
var MasterTableSchema = new Schema(
    {
        

    
        status: {
            type: String,
            default: 1,
        },

        
        cuisine: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuisine' },
        cuisines: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuisines' },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
        spice_level: { type: mongoose.Schema.Types.ObjectId, ref: 'SpiceLevel' },



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
