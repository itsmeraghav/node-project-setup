const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  bcrypt = require("bcrypt");
const string = require("joi/lib/types/string");

const UserSchema = new Schema(
  {
    full_name: {
      type: String
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
      required: true,
      unique: true
    },
    status: {
      type: Number,
      default: 0
      //0 => inactive ,1 =active, 2 =deleted, 3=>approved ,4=>approved
    },
    email_verify: {
      type: Number,
      default: 0
      //0 => no ,1 =yes, 
    },
    is_profile_completed: {
      type: Number,
      default: 0
      //0 => no ,1 =yes, 
    },
    // owner_name: String,
    // membership_id

    contact_number: {
      type: Number,
      unique: true
    },


    alternate_contact_number: {
      type: Number,
      unique: true
    },

    // id_proof_number: String,
    // scanned_id: String,
    qualification: {
      type: String,
    },

    reference: {
      type: String
    },

    profile_pic: {
      type: String
    },

    country: {
      type: String
    },

    state: {
      type: String
    },


    city: {
      type: String
    },


    zipcode: {
      type: String
    },

    zipcodes: {
      type: String
    },

    address: {
      type: String
    },

    company: {
      type: String
    },


    // state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null },
    // city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    // client_code: String,
    password: {
      type: String
    },

    unique_code: {
      type: String
    },


    hash: {
      type: String
    },

    salt: {
      type: String
    },

    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    // status: Number,//0 => inactive ,1 =active, 2 =deleted
    dob: {
      type: Date
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    fare_amount: {
      type: Number
    },


    owner_name: {
      type: String
    },

    last_seen: { type: Date, required: true, default: Date.now },



    isActive: {
      type: Number,
      default: 0,
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
    unique_user_id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
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
