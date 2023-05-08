var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
var AboutMeSchema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: [true, "Email already exist"],
            required: [true, "Please enter your email"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "is invalid"],
        },

        username: {
            type: String,
            required: true,
             unique: true
        },
        contact_number: {
            type: String,
            unique: true,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
            default: "MALE"
        },
        zipcode: {
            type: String,
            required: true,

        },

        address: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },


        city: {
            type: String,
            required: true,
        },
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
        }


    },
    { timestamps: true, collection: "AboutMe" }
);

AboutMeSchema.plugin(uniqueValidator, { message: "is already taken." });
// module.exports =

module.exports = mongoose.model("AboutMe", AboutMeSchema);

