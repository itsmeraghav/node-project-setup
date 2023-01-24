const express = require("express");
const router = express.Router();
const MasterTableController = require("./MasterTableController");
const { validate } = require("../../util/validations");
const validations = require("./MasterTableValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  MasterTableController.create
);

router.post(
  "/list",
  // verifyToken,
  MasterTableController.list
);

router.get(
  "/list",
  // verifyToken,
  MasterTableController.listAll
);

router.get(
  "/:slug",
  // verifyToken,
  MasterTableController.detail
);

router.delete(
  "/:slug",
  // verifyToken,
  MasterTableController.delete
);

router.post(
  "/update-status/:slug",
  // verifyToken,
  MasterTableController.UpdateStatus
);

router.put(
  "/:slug",
  // verifyToken,
  MasterTableController.update
);

module.exports = router;
