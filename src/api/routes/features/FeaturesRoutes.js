const express = require("express");
const router = express.Router();
const FeaturesController = require("./FeaturesController");
const { validate } = require("../../util/validations");
const validations = require("./FeaturesValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  FeaturesController.create
);

router.post(
  "/list",
  // verifyToken,
  FeaturesController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  FeaturesController.dropdown
);

router.get(
  "/detail/:slug",
  // verifyToken,
  FeaturesController.detail
);

router.delete(
  "/delete/:slug",
  // verifyToken,
  FeaturesController.delete
);

router.post(
  "/update-status/:slug",
  // verifyToken,
  FeaturesController.UpdateStatus
);

router.put(
  "/update/:slug",
  // verifyToken,
  FeaturesController.update
);

module.exports = router;
