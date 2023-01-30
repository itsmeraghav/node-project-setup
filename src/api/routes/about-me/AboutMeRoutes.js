const express = require("express");
const router = express.Router();
const AboutMeController = require("./AboutMeController");
const { validate } = require("../../util/validations");
const validations = require("./AboutMeValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  validate(validations.createAboutMe),
  AboutMeController.create
);

router.post(
  "/list",
  // verifyToken,
  AboutMeController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  AboutMeController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  AboutMeController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  AboutMeController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  AboutMeController.UpdateStatus
);

router.put(
  "/update/:_id",
  validate(validations.updateAboutMe),
  // verifyToken,
  AboutMeController.update
);

module.exports = router;