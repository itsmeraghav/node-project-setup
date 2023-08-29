const express = require("express");
const router = express.Router();
const ExtraServicesController = require("./ExtraServicesController");
const { validate } = require("../../util/validations");
const validations = require("./ExtraServicesValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  // validate(validations.create),
  ExtraServicesController.create
);

router.post(
  "/list",
  // verifyToken,
  ExtraServicesController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  ExtraServicesController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  ExtraServicesController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  ExtraServicesController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  ExtraServicesController.UpdateStatus
);

router.put(
  "/update/:_id",
  //validate(validations.updateExtraServices),
  // verifyToken,
  ExtraServicesController.update
);

module.exports = router;
