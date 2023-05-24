const express = require("express");
const router = express.Router();
const AvailabilityController = require("./AvailabilityController");
 const { validate } = require("../../util/validations");
const validations = require("./AvailabilityValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
// validate(validations.create),
  AvailabilityController.create
);

router.post(
  "/list",
  // verifyToken,
  AvailabilityController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  AvailabilityController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  AvailabilityController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  AvailabilityController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,f
  AvailabilityController.UpdateStatus
);

router.put(
  "/update/:_id",
 //validate(validations.updateAvailability),
  // verifyToken,
  AvailabilityController.update
);

module.exports = router;