const express = require("express");
const router = express.Router();
const MyStoreController = require("./MyStoreController");
const { validate } = require("../../util/validations");
const validations = require("./MyStoreValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  validate(validations.createdish),
  MyStoreController.create
);

router.post(
  "/list",
  // verifyToken,
  MyStoreController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  MyStoreController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  MyStoreController.detail
);

// router.delete(
//   "/delete/:_id",
//   // verifyToken,
//   MyStoreController.delete
// );

router.post(
  "/update-status/:_id",
  // verifyToken,
  MyStoreController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
  MyStoreController.update
);

module.exports = router;
