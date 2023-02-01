var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var AddDishSchema = new Schema(
    {
        dish_title:{
            type:String,
            required:true,
        },       
            description:{
                type:String,
                required:true,
            },
            ingredients:{
                type:String,
                required:true,
            },
            tags:{
                type:String,
                required:true,
            },

            preparation_time:{
                type:String,
                required:true,
            },

            cost:{
                type:Number,
                required:true,
            },

            isDeleted: {
                type: Boolean,
                default: false,
              },

            status: {
                type: Number,
                default: 1,
              },
          
            is_edit: {
                type: Number,
                default: 1,
              },

            dish_photo:{
                type:String,
              //  required:true,
                },
                user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                     ref: 'User',
                    },
        },
        { timestamps: true, collection: "AddDish" }
      );
      
      AddDishSchema.plugin(uniqueValidator, { message: "is already taken." });
      // module.exports =
      
      module.exports = mongoose.model("AddDish", AddDishSchema);
    