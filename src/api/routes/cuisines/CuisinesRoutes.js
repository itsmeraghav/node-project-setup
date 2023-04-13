const express = require("express");
const router = express.Router();
const CuisinesController = require("./CuisinesController");
const { validate } = require("../../util/validations");
const validations = require("./CuisinesValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  validate(validations.createtype),
  CuisinesController.create
);

router.post(
  "/list",
  // verifyToken,
  CuisinesController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  CuisinesController.dropdown
);

router.get(
  "/:_id",  
  // verifyToken,
  CuisinesController.detail
);

router.delete(
  "/:_id",
  // verifyToken,
  CuisinesController.delete
);

// router.post(
//   "/update-status/:_id",
//   // verifyToken,
//   CuisinesController.UpdateStatus
// );

// router.put(
//   "/update/:_id",
//   validate(validations.updateProfile),
//   // verifyToken,
//   CuisinesController.update
// );

module.exports = router;
