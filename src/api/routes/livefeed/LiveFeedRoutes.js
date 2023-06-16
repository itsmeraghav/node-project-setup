const express = require("express");
const router = express.Router();
const LiveFeed = require("./LiveFeedController");
const { validate } = require("../../util/validations");
// const validations = require("./LiveFeedValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 LiveFeed.create
);

router.post(
  "/list",
  // verifyToken,
  LiveFeed.list
);

router.get(
  "/dropdown",
  // verifyToken,
  LiveFeed.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  LiveFeed.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  LiveFeed.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  LiveFeed.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
  LiveFeed.update
);

module.exports = router;