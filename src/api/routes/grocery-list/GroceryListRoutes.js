const express = require("express");
const router = express.Router();
const GroceryListController = require("./GroceryListController");
const { validate } = require("../../util/validations");
const validations = require("./GroceryListValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.createtype),
  GroceryListController.create
);

router.post(
  "/list",
  // verifyToken,
  GroceryListController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  GroceryListController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  GroceryListController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  GroceryListController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  GroceryListController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
   validate(validations.updateProfile),
  GroceryListController.update
);

module.exports = router;
