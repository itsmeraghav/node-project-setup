var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var AboutMeSchema = new Schema(
    {
        
        username: {
            type: String,
            required: true,
             unique: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: [true, "Email already exist"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "is invalid"],
        },
     
        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
            default: "MALE"
        },
        contact_number: {
            type: String,
            unique: true,
        },
        dob:{
            type:Date,
        },
        address: {
            type: String,
        },
        
        country: {
            type: String,
        },
        state: {
            type: String,
        },    
        zipcode: {
            type: String,
        },
        city: {
            type: String,
        },
        about_me:{
            type:String
        },
        ethnicity:[ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MasterTable",
          }],
          language: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MasterTable",
          }],
          select_cuisines_detail: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MasterTable",
          }],
          other_service_offered: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MasterTable",
          }],
        facebook_link:{
            type:String
        },
        youtube_link:{
            type:String
        },
        twitter_link:{
            type:String
        },
        instagram_link:{
            type:String
        },
        upload_license:{
            type:String,
            default:""
        },
        license_certificates:{
            type:String,
            default:""
        },
        
        upload_education_certificates:{
            type:String,
            default:""
        },
        upload_awards:{
            type:String,
            default:""
        },
        license_expiry_date:{
            type:Date,
        },

        is_edit: {
            type: Number,
            default: 1,
        },
        is_deleted: {
            type: Number,
            default: 0,
        },
        status: {
            type: Number,
            default: 1,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
    },
    { timestamps: true, collection: "AboutMe" }
);

AboutMeSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("AboutMe", AboutMeSchema);

