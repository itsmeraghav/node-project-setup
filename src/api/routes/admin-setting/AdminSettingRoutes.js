const express = require('express');
const router = express.Router();
const AdminSettingController = require('./AdminSettingController');
const { validate } = require('../../util/validations');
const validations = require('./AdminSettingValidations');
const { verifyToken } = require('../../util/auth');

router.post(
    "/create-setting",
    // verifyToken,
    AdminSettingController.createSetting
)
      
 
router.get(
    "/get-page",
    AdminSettingController.getPage
)



module.exports = router;
