const express = require("express");
const router = express.Router();
const CountryController = require("./CountryController");
 const { validate } = require("../../util/validations");
const validations = require("./CountryValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
// validate(validations.create),
  CountryController.create
);

router.post(
  "/list",
  // verifyToken,
  CountryController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  CountryController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  CountryController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  CountryController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  CountryController.UpdateStatus
);

router.put(
  "/update/:_id",
 //validate(validations.updateCountry),
  // verifyToken,
  CountryController.update
);

module.exports = router;