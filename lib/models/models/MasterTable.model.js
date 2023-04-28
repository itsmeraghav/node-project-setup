
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require('slug')
var uniqueValidator = require("mongoose-unique-validator");
var MasterTableSchema = new Schema(
    {

        name:{
            type:String,
        },

        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
        status: {
            type: String,
            default: 1,
        }, 
        
        //cuisines =1
        //spice level list=2
        // type list=3
        //cuisine  =4
        //Dish Speciality =
        //Sample Intervel =
        //Discount =
        //cuisine=

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
