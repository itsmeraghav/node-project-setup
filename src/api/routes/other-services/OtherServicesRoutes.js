const express = require("express");
const router = express.Router();
const OtherServicesController = require("./OtherServicesController");
const { validate } = require("../../util/validations");
const validations = require("./OtherServicesValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.createservice),
  OtherServicesController.create
);

router.post(
  "/list",
  // verifyToken,
  OtherServicesController.list
);

// router.get(
//   "/dropdown",
//   // verifyToken,
//   OtherServicesController.dropdown
// );

router.get(
  "/detail/:_id",
  // verifyToken,
  OtherServicesController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  OtherServicesController.delete
);

// router.post(
//   "/update-status/:_id",
//   // verifyToken,
//   OtherServicesController.UpdateStatus
// );

router.put(
  "/update/:_id",
  // verifyToken,
  validate(validations.updateProfile),
  OtherServicesController.update
);

module.exports = router;
