const {
  models: { User,  AdminSettings },
} = require("../../../../lib/models");
const moment = require("moment");
const mailer = require("../../../../lib/mailer");

const { logError } = require("../../../../lib/util");

var _ = require("lodash");

class UserController {
  

  async createSetting(req, res, next) {
   
    let {
      iosForceUpdate,
      iosAppVersion,
      maintenance ,
      is_launch
    } = req.body; 

    try { 

      let adminSetting = new AdminSettings();
      const platform = req.headers["x-testing-platform"];
      adminSetting.iosForceUpdate = iosForceUpdate;
      adminSetting.iosAppVersion = iosAppVersion;
      adminSetting.maintenance = maintenance;  
      adminSetting.is_launch = is_launch;
      adminSetting = await adminSetting.save();
      return res.success({}, req.__("EMAIL_SEND"), req.__("VERIFICATION_EMAIL_SENT"));
    } catch (err) {
      console.log(err);
      return next(err);
    }

  }
 

  async getAdminSetting(req, res) {
    let adminSetting = await AdminSettings.findOne();
    const userJson = {};
    if (adminSetting) {
      userJson.distanceRadius = adminSetting.distanceRadius;
      userJson.maximum = adminSetting.maximum;
      userJson.minimum = adminSetting.minimum;
    }
    return res.success(
      userJson,
      req.__("SETTING_INFORMATION")
    );
  }

  async getPage(req, res, next) {
    let { pageSlug } = req.query;
    let page = await Page.findOne({ slug: pageSlug, isSuspended: false });
    try {
      return res.success(page, "get slug of pages");
    } catch (err) {
      return next(err);
    }
  }

}

module.exports = new UserController();
