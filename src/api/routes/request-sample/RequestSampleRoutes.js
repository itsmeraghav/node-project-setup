const express = require("express");
const router = express.Router();
const RequestSampleController = require("./RequestSampleController");
 const { validate } = require("../../util/validations");
const validations = require("./RequestSampleValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
//  validate(validations.create),
  RequestSampleController.create
);

router.post(
  "/list",
  // verifyToken,
  RequestSampleController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  RequestSampleController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  RequestSampleController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  RequestSampleController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,f
  RequestSampleController.UpdateStatus
);

router.put(
  "/update/:_id",
 //validate(validations.updateRequestSample),
  // verifyToken,
  RequestSampleController.update
);

module.exports = router;