const express = require("express");
const router = express.Router();
const FollowersfollowingController = require("./FollowersfollowingController");
const { validate } = require("../../util/validations");
// const validations = require("./FollowersfollowingValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  // validate(validations.create),
  FollowersfollowingController.create
);

router.post(
  "/delete/:_id",
  //  validate(validations.updateFollowersfollowing),
  // verifyToken,
  FollowersfollowingController.delete
);

router.post(
  "/list",
  // verifyToken,
  // validate(validations.create),
  FollowersfollowingController.list
);
module.exports = router;
