const express = require("express");
const router = express.Router();
const UtilController = require("./UtilController");
const { validate } = require("../../util/validations");
const validations = require("./UtilValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/upload-file",
  //validate(validations.uploadFile),
  UtilController.uploadFile
);

module.exports = router;
