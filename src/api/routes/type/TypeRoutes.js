const express = require("express");
const router = express.Router();
const TypeController = require("./TypeController");
const { validate } = require("../../util/validations");
const validations = require("./TypeValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  validate(validations.createtype),
  TypeController.create
);

router.post(
  "/list",
  // verifyToken,
  TypeController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  TypeController.dropdown
);

router.get(
  "/:_id",  
  // verifyToken,
  TypeController.detail
);

router.delete(
  "/:_id",
  // verifyToken,
  TypeController.delete
);

// router.post(
//   "/update-status/:_id",
//   // verifyToken,
//   TypeController.UpdateStatus
// );

// router.put(
//   "/update/:_id",
//   validate(validations.updateProfile),
//   // verifyToken,
//   TypeController.update
// );

module.exports = router;
