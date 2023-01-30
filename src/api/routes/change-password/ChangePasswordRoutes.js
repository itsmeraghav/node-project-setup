const express = require("express");
const router = express.Router();
const ChangePasswordController = require("./ChangePasswordController");
const { validate } = require("../../util/validations");
const validations = require("./ChangePasswordValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/changepassword/:_id",
  // verifyToken,
//   validate(validations.createdish),
  ChangePasswordController.changepassword
);

module.exports = router;
