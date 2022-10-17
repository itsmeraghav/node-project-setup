var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

   
// `in_is_active` tinyint(1) UNSIGNED ZEROFILL NOT NULL DEFAULT '1',
// `message_status` tinyint(4) NOT NULL COMMENT '0: disable, 1: enable',
// `in_is_status` tinyint(4) NOT NULL COMMENT '0: offline, 1: online',
// `in_is_deleted` tinyint(4) NOT NULL,
// `dt_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
// `is_profile_completed` tinyint(1) NOT NULL DEFAULT '0'
 
 
 
 
var UserSchema = new mongoose.Schema({
  full_name:  {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
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

  contact_number: String,
  alternate_contact_number: String,
  // id_proof_number: String,
  // scanned_id: String,
  qualification: String,
  reference: String,
  profile_pic: String,
  country: String,
  state: String,
  city: String,
  zipcode: String,
  zipcodes: String,
  address: String,
  company: String,
  // state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null },
  // city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
  // client_code: String,
  password: String,
  unique_code: String,
  hash: String,
  salt: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  // status: Number,//0 => inactive ,1 =active, 2 =deleted
  dob: Date,
  gender: String,
  fare_amount:Number,
  owner_name: String,
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  last_seen: { type: Date, required: true, default: Date.now },
  // post_code: String,
  reset_code: String,
  active_code: String
}, { timestamps: true, collection: 'Users' });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  //exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000) + (60 * 60 * 24),
  }, secret);
};

UserSchema.methods.toAuthJSON = function () {
  var today = new Date();
  var exp = new Date(today);
  return {
    email: this.email,
    token: this.generateJWT(),
    date_format: this.date_format,
    role: this.role,
    expires: parseInt(exp.getTime() / 1000) + (60 * 60 * 24),
    profile_pic: this.profile_pic
  };
};


mongoose.model('User', UserSchema);
