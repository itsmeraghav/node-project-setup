const express = require("express");
const router = express.Router();
const DistanceUnitController = require("./DistanceUnitController");
 const { validate } = require("../../util/validations");
const validations = require("./DistanceUnitValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 //validate(validations.create),
  DistanceUnitController.create
);

router.put(
    "/update/:_id",
   validate(validations.updateDistanceUnit),
    // verifyToken,
    DistanceUnitController.update
  );
  router.post(
    "/list",
    // verifyToken,
    DistanceUnitController.list
  );

  router.delete(
    "/delete/:_id",
    // verifyToken,
    DistanceUnitController.delete
  );
  module.exports = router;  