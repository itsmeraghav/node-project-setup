const express = require("express");
const router = express.Router();
const EventOrdersController = require("./EventOrdersController");
const { validate } = require("../../util/validations");
// const validations = require("./EventOrdersValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  // validate(validations.create),
  EventOrdersController.create
);

router.post(
  "/list",
  // verifyToken,
  EventOrdersController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  EventOrdersController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  EventOrdersController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  EventOrdersController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  EventOrdersController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
  // validate(validations.updateProfile),
  EventOrdersController.update
);

module.exports = router;
