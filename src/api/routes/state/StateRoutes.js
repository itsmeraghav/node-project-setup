const express = require("express");
const router = express.Router();
const StateController = require("./StateController");
 const { validate } = require("../../util/validations");
const validations = require("./StateValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 //validate(validations.create),
  StateController.create
);

router.post(
  "/list",
  // verifyToken,
  StateController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  StateController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  StateController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  StateController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  StateController.UpdateStatus
);

router.put(
  "/update/:_id",
// validate(validations.updateState),
  // verifyToken,
  StateController.update
);

module.exports = router;