const express = require("express");
const router = express.Router();
const MembershipController = require("./MembershipController");
 const { validate } = require("../../util/validations");
const validations = require("./MembershipValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.create),
  MembershipController.create
);

router.post(
  "/list",
  // verifyToken,
  MembershipController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  MembershipController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  MembershipController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  MembershipController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  MembershipController.UpdateStatus
);

router.put(
  "/update/:_id",
 validate(validations.updateMembership),
  // verifyToken,
  MembershipController.update
);

module.exports = router;