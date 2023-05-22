
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 var GrocerySchema = new Schema({

    list_title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },
     
        item:{
            type:String,
            required:true,
        },
      
 
        minimum_quantity:{
            type:Number,
            required:true
        },

        unit:{
            type:String,
            enum:["Kilogram","Grams","Litres","Pieces"]
        },
        
        quantity:{
            type:Number,
            required:true
        },
         
        item_photo:{
            type:String,
            default:""
        },
        total:{
            type:Number,
            required:true
        },
        
    

    grocery_photos:{
        type:String,
        default:""
    },


  status: {
    type: Number,
    default: 1
  },
  is_edit: {
    type: Number,
    default: 1
  },
  is_deleted: {
    type: Number,
    default: 0,
},
 
}, {timestamps: true,collection: 'Grocery'});

GrocerySchema.plugin(uniqueValidator, { message: 'is already taken.' });
 

 module.exports = mongoose.model("Grocery", GrocerySchema);