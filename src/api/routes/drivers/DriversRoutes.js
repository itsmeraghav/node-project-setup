const express = require("express");
const router = express.Router();
const DriversController = require("./DriversController");
const { validate } = require("../../util/validations");
const validations = require("./DriversValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.createtype),
  DriversController.create
);

router.post(
  "/list",
  // verifyToken,
  DriversController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  DriversController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  DriversController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  DriversController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  DriversController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
   validate(validations.updateProfile),
  DriversController.update
);

router.get(
  "/search_driver",
  // verifyToken,
  DriversController.search_driver
);

module.exports = router;
