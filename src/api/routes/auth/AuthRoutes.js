const express = require("express");
const router = express.Router();
const AuthController = require("./AuthController");
const { validate } = require("../../util/validations");
const validations = require("./AuthValidations");
const { verifyToken } = require("../../util/auth");
const {
  models: { Users },
} = require("../../../../lib/models");

router.get("/generate-token/:_id", AuthController.generateToken);

router.post(
  "/login",
  //validate(validations.logIn),
  AuthController.logIn
);

router.post("/signup", validate(validations.signup), AuthController.signup);

router.get("/logout", verifyToken, AuthController.logOut);

router.post(
  "/resend-otp",
  validate(validations.resetOtp),
  AuthController.resendOtp
);

router.post("/send-otp", validate(validations.SendOtp), AuthController.SendOtp);

router.post(
  "/forgot-password",
  validate(validations.forgotPassword),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validate(validations.resetPassword),
  AuthController.resetPassword
);

router.post(
  "/verify-otp",
  validate(validations.verifyOtp),
  AuthController.verifyOtp
);

// exrta api
router.post(
  "/social-login",
  validate(validations.socialLogIn),
  AuthController.socialLogin
);

router.post(
  "/social-signup",
  validate(validations.socialSignup),
  AuthController.socialSignup
);

router.post(
  "/update-notification",
  verifyToken,
  validate(validations.updateNotification),
  AuthController.updateNotification
);

router.get("/language-list", verifyToken, AuthController.languageList);

router.get("/staticPages/:slug", AuthController.staticPage);

module.exports = router;
