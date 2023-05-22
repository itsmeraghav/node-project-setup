const express = require("express");
const router = express.Router();
const GroceryController = require("./GroceryController");
const { validate } = require("../../util/validations");
const validations = require("./GroceryValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.createtype),
  GroceryController.create
);

router.post(
  "/list",
  // verifyToken,
  GroceryController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  GroceryController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  GroceryController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  GroceryController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  GroceryController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
   validate(validations.updateProfile),
  GroceryController.update
);

module.exports = router;
