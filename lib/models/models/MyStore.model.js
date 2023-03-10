var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var MyStoreSchema = new Schema(
    {
        search_product:{
            type:String
        },
        product_title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true
        },
        ingredients:{
            type:String,
            required:true 
        },
        tags:{
            type:String,
            required:true 
        },
        spice_level:{
            type:String,
            required:true,
        },
        type:{
            type:String,
            required:true,
        },
        product_photos:{
            type:String,
            default:""
            // required:true,
        },
         is_edit: {
            type: Number,
            default: 1,
        },
        is_deleted: {
            type: Number,
            default: 0,
        },
        status:{
            type: Number,
            default: 1,
        }


    },
        { timestamps: true, collection: "MyStore" }
    );
    
    MyStoreSchema.plugin(uniqueValidator, { message: "is already taken." });
    // module.exports =
    
    module.exports = mongoose.model("MyStore", MyStoreSchema);
  