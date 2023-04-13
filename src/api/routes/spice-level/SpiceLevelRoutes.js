const express = require("express");
const router = express.Router();
const SpiceLevelController = require("./SpiceLevelController");
const { validate } = require("../../util/validations");
const validations = require("./SpiceLevelValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  validate(validations.createtype),
  SpiceLevelController.create
);

router.post(
  "/list",
  // verifyToken,
  SpiceLevelController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  SpiceLevelController.dropdown
);

router.get(
  "/:_id",  
  // verifyToken,
  SpiceLevelController.detail
);

router.delete(
  "/:_id",
  // verifyToken,
  SpiceLevelController.delete
);

// router.post(
//   "/update-status/:_id",
//   // verifyToken,
//   SpiceLevelController.UpdateStatus
// );

// router.put(
//   "/update/:_id",
//   validate(validations.updateProfile),
//   // verifyToken,
//   SpiceLevelController.update
// );

module.exports = router;
