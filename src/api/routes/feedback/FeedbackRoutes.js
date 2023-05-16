const express = require("express");
const router = express.Router();
const FeedbackController = require("./FeedbackController");
 const { validate } = require("../../util/validations");
const validations = require("./FeedbackValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.create),
  FeedbackController.create
);

router.post(
  "/list",
  // verifyToken,
  FeedbackController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  FeedbackController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  FeedbackController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  FeedbackController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,f
  FeedbackController.UpdateStatus
);

router.put(
  "/update/:_id",
 //validate(validations.updateFeedback),
  // verifyToken,
  FeedbackController.update
);

module.exports = router;