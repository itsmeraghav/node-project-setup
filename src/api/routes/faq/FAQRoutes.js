const express = require("express");
const router = express.Router();
const FAQController = require("./FAQController");
const { validate } = require("../../util/validations");
const validations = require("./FAQValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  validate(validations.createservice),
  FAQController.create
);

router.post(
  "/list",
  // verifyToken,
  FAQController.list
);

// // router.get(
// //   "/dropdown",
// //   // verifyToken,
// //   FAQController.dropdown
// // );

router.get(
  "/detail/:_id",
  // verifyToken,
  FAQController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  FAQController.delete
);

// // router.post(
// //   "/update-status/:_id",
// //   // verifyToken,
// //   FAQController.UpdateStatus
// // );

router.put(
  "/update/:_id",
  // verifyToken,
 // validate(validations.updateProfile),
  FAQController.update
);

module.exports = router;
