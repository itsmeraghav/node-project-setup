const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  bcrypt = require("bcrypt");
const string = require("joi/lib/types/string");

const UserSchema = new Schema(
  {
    full_name: {
      type: String,
     
    },
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
      unique: [true,  "UserName ealready exist"],
    },
   
    contact_number: {
      type: String,
      // unique: true,
    },
    dob: {
      type: Date
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State'
    },
    city: {
      type: String
    },

    password:{
      type:String
    },
    
    
    confirm_password:{
      type:String
    },
    zipcode: {
      type: String
    },

    zipcode_2: {
      type: String
    },

    fare_amount:{
      type:Number
    },
    
    address: {
      type: String
    },

    company_name: {
      type: String
    },

    qualification:{
      type:String
    },


    // state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null },
    // city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    // client_code: String,

    hash: {
      type: String
    },

    salt: {
      type: String
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default:"MALE"
    },

    isActive: {
      type: Number,
      default: 1,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    OTPVerification: {
      type: String,
      default: "",
    },
    OTPExpires: {
      type: Number,
      default: Date.now() + 3600000,
    },
    // new field
    isSuspended: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false, // it will false when user we have otp screen
    },
    deviceType: {
      type: String,
    },
    authTokenIssuedAt: {
      type: Number,
    },
    emailVerifyToken: {
      type: String,
    },
    deviceToken: {
      type: String,
      trim: true,
      default: "",
    },
    signUpType: {
      type: String,
      enum: ["normal", "android", "ios"],
      default: "normal",
    },
   
    isFreezed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
    collection: "Users",
    id: false,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ITERATIONS, 10) || 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
    next();
  } catch (e) {
    next(e);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (e) {
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
