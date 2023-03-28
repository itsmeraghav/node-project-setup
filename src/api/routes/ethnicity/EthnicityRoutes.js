const express = require('express');
const router = express.Router();
const ethnicityController = require('./EthnicityController');
const { validate } = require('../../util/validations');
const validations = require('./EthnicityValidations');
const { verifyToken } = require('../../util/auth');

router.post(
    "/create",
    // verifyToken,
    validate(validations.createtype),
    ethnicityController.create
);

router.post(
    "/list",
    // verifyToken,
    ethnicityController.list
);
router.get(
    "/list",
    // verifyToken,
    ethnicityController.listAll
);
 

router.get(
    "/:slug",
    // verifyToken,
    ethnicityController.detail
);

router.delete(
    "/:slug",
    // verifyToken,
    ethnicityController.delete
);

router.put(
    "/:slug",
    // verifyToken,
    validate(validations.updateProfile),
    ethnicityController.update
);
 


module.exports = router;
