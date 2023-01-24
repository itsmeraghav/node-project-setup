const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const logIn = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  deviceToken: Joi.string()
    .trim()
    .optional()
    .allow(""),
});

const socialLogIn = Joi.object().keys({
  socialType: Joi.string().required(),
  socailId: Joi.string().required(),
  deviceToken: Joi.string()
    .trim()
    .optional()
    .allow(""),
});

const socialSignup = Joi.object().keys({
  socialType: Joi.string().required(),
  socailId: Joi.string().required(),
  email: Joi.string()
    .allow(null, "")
    .required(),
  full_Name: Joi.string()
    .allow(null, "")
    .required(),
  deviceToken: Joi.string()
    .trim()
    .optional()
    .allow(""),
});

const forgotPassword = Joi.object().keys({
  email: common.email,
});

const resetPassword = Joi.object().keys({
  token: Joi.string().required(),
  email: common.email,
  password: Joi.string()
    .min(8)
    .max(20)
    .required(),
    confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .error(([error]) => {
      const { locale } = error.options;
      const language = languages[locale];
      return {
        message: language.validation.custom.sameAs(
          error.context.key,
          "password"
        ),
      };
    }),
});

const updateNotification = Joi.object().keys({
  notificationStatus: Joi.boolean().required(),
});

const verifyOtp = Joi.object().keys({
  otp: Joi.string().required(),
  otpType: Joi.string().required(),
  mobile_number: Joi.string().required(),
  deviceToken: Joi.string()
    .trim()
    .optional()
    .allow(""),
});

const SendOtp = Joi.object().keys({
  mobile_number: Joi.string().required(),
  otpType: Joi.string().required(),
});

const resetOtp = Joi.object().keys({
  otpType: Joi.string().required(),
  email: common.email,
});

const signup = Joi.object().keys({
  email: common.email,
  username:Joi.string().optional(),
  full_name: Joi.string()
    // .required()
    // .error(([error]) => {
    //   return {
    //     message: "Please enter your full Name",
    //   };
    // })
    .max(150)
    .error(([error]) => {
      return {
        message: "Your full Name cannot exceed 150 characters.",
      };
    }),
    country:Joi.optional(),
    company_name:Joi.optional(),
   state:Joi.optional(),
   city:Joi.optional(),
   zipcode:Joi.optional(),
   zipcodes:Joi.optional(),
   qualification:Joi.optional(),
  address:Joi.optional(),


  // middle_Name: Joi.optional(),
  // last_Name: Joi.string()
  //   .required()
  //   .error(([error]) => {
  //     return {
  //       message: "Please enter your last Name",
  //     };
  //   })
  //   .max(50)
  //   .error(([error]) => {
  //     return {
  //       message: "Your last Name cannot exceed 50 characters.",
  //     };
  //   }),
  // father_Name: Joi.string()
  //   .required()
  //   .error(([error]) => {
  //     return {
  //       message: "Please enter your father Name",
  //     };
  //   })
  //   .max(50)
  //   .error(([error]) => {
  //     return {
  //       message: "Your father Name cannot exceed 50 characters.",
  //     };
  //   }),
  // mother_Name: Joi.string()
  //   .required()
  //   .error(([error]) => {
  //     return {
  //       message: "Please enter your mother Name",
  //     };
  //   })
  //   .max(50)
  //   .error(([error]) => {
  //     return {
  //       message: "Your mother Name cannot exceed 50 characters.",
  //     };
   // }),
  // marital_status: Joi.string().required(),
  dob: Joi.string().required(),
  contact_number: Joi.string()
    .required()
    .error(([error]) => {
      return {
        message: "Contact number required",
      };
    }),
  // category: Joi.string().required(),
  // pan_Number: Joi.optional(),
  // religion: Joi.optional(),
  // minority: Joi.optional(),
  // aadhar_number: Joi.string().required(),
  // jan_aadhar: Joi.string().required(),
  // body_mark: Joi.optional(),
  role: Joi.optional(),
  //disability_status: Joi.optional(),
  gender: Joi.string(),
  deviceType: Joi.optional(),
  deviceToken: Joi.optional(),
  password: Joi.string()
    .min(8)
    .max(20)
    .required(),
    confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .error(([error]) => {
      return {
        message: "Confirm password required.",
      };
    }),
});

module.exports = {
  logIn,
  socialLogIn,
  socialSignup,
  resetPassword,
  updateNotification,
  verifyOtp,
  resetOtp,
  signup,
  forgotPassword,
  SendOtp,
};
