const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const logIn = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  contact_number: Joi.string().optional(),
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
  username:Joi.string().required(),
  full_name: Joi.string().required()
    .max(150)
    .error(([error]) => {
      return {
        message: "Your full Name cannot exceed 150 characters.",
      };
    }),
    country:Joi.string(),
    company_name:Joi.optional(),
   state:Joi.optional(),
   city:Joi.optional(),
   zipcode:Joi.optional(),
   zipcode_2:Joi.optional(),
   fare_amount:Joi.optional(),
   qualification:Joi.optional(),
    address:Joi.optional(),
    dob: Joi.string().optional(),
    contact_number: Joi.string()
      .required()
      .error(([error]) => {
        return {
          message: "Contact number required",
        };
      }),
      role: Joi.optional(),
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
