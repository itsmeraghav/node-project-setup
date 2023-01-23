const {
  models: { User, Page, AdminSettings },
} = require("../../../../lib/models");
var slug = require('slug')
const moment = require("moment");
const mongoose = require("mongoose");
const mailer = require("../../../../lib/mailer");
const asyncParallel = require("async/parallel");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;
const { logError } = require("../../../../lib/util");
var _ = require("lodash");

class UserController {
  async updatePassword(req, res) {
    const { user } = req;
    const { currentPassword, newPassword } = req.body;

    const matched = await user.comparePassword(currentPassword);
    if (!matched) {
      return res.warn(
        {},
        req.__("PASSWORD_MATCH_FAILURE"),
        req.__("PASSWORD_NOT_SAME")
      );
    }
    const matcheAddedPassword = await user.comparePassword(newPassword);
    if (matcheAddedPassword) {
      return res.warn(
        {},
        req.__("OLD_NEW_PASSWORD_NOT_BE_SAME"),
        req.__("PASSWORD_NOT_BE_SAME")
      );
    }
    user.password = newPassword;
    await user.save();
    mailer
      .sendMail("password-update", req.__("PASSWORD_UPDATED"), user.email, {
        name: user.name,
      })
      .catch((error) => {
        logError(`Failed to send password password email to ${user.email}`);
        logError(error);
      });

    return res.success({}, "", req.__("PASSWORD_UPDATED"));
  }


  async create(req, res, next) {
    let {
      full_name
    } = req.body;
    try {
      var newRecord = new User(req.body);
      return newRecord.save().then(results => {
        return res.success(
          results,
          req.__(" USER_CREATE_SUCCESSFULLY")
        );
      })
        .catch(err => {
          return res.json({ data: err });
        })
    } catch (err) {

      return next(err);
    }

  }

  async profileAccountInfo(req, res) {
    let { user } = req;
    /*let userInfo = await User.findOne({
      _id: user._id,
      isDeleted: false,
    }).populate("selectedLanguages", "name");*/
    let userInfo = await User.aggregate([
      {
        $match: {
          _id: user._id,
          isDeleted: false,
        },
      },
    ]);

    if (!userInfo) {
      return res.notFound("", req.__("INVALID_REQUEST"));
    }

    if (userInfo.isSuspended) {
      return res.notFound("", req.__("YOUR_ACCOUNT_SUSPENDED"));
    }

    const userJson = userInfo[0];
    ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
      (key) => delete userJson[key]
    );
    //userJson.user = userInfo;

    return res.success(
      {
        profile: userJson,
      },
      req.__("PROFILE_INFORMATION")
    );
  }

  async ProfileDetail(req, res, next) {
    let { pageSlug } = req.query;
    let page = await Page.findOne({ slug: pageSlug, isSuspended: false });
    try {
      return res.success(page, "get slug of pages");
    } catch (err) {
      return next(err);
    }
  }



  async list(req, res, next) {
    /** Filteration value */
    let limit = req.body.length
      ? parseInt(req.body.length)
      : DATATABLE_DEFAULT_LIMIT;
    let skip = req.body.start
      ? parseInt(req.body.start)
      : DATATABLE_DEFAULT_SKIP;
    skip = skip === 0 ? 0 : (skip - 1) * limit;
    var conditions = {
      isDeleted: false,
    };

    let filterObj = req.body.filter ? req.body.filter : null;
    if (filterObj) {
      //apply filter
      if (filterObj?.email) {
        conditions["email"] = filterObj?.email;
      }
      if (filterObj?.first_Name) {
        conditions["first_Name"] = filterObj?.first_Name;
      }
      if (filterObj?.role) {
        conditions["role"] = filterObj?.role;
      }
      if (filterObj?.isVerified) {
        conditions["isVerified"] = filterObj?.isVerified;
      }
      if (filterObj?.isActive) {
        conditions["isActive"] = filterObj?.isActive;
      }
      if (filterObj?.mobile_number) {
        conditions["mobile_number"] = filterObj?.mobile_number;
      }
    }
    asyncParallel(
      {
        data: function (callback) {
          User.find(
            conditions,
            {
              _id: 1,
              photo: 1,
              first_Name: 1,
              last_Name: 1,
              email: 1,
              isActive: -1,
              mobile_number: 1,
              is_edit: 1,
              isVerified: 1,
              slug: 1,
              role: 1,
              district_id: 1,
              isSuspended: 1,
              created: 1,
              updatedAt: 1,
            },
            { sort: { created: -1 }, skip: skip, limit: limit }
          )
            .populate("role", "name _id")
            .populate({
              path: "district_id",
              populate: {
                path: "unit_id",
              },
            })
            .exec((err, result) => {
              callback(err, result);
            });
        },
        records_filtered: function (callback) {
          User.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function (callback) {
          User.countDocuments({ isDeleted: false }, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
      },
      function (err, results) {
        if (err) return res.json({ data: err });

        let data = {
          records: results && results.data ? results.data : [],
          recordsFiltered:
            results && results.records_filtered ? results.records_filtered : 0,
          recordsTotal:
            results && results.records_total ? results.records_total : 0,
        };
        return res.success(data, req.__("USER_LIST_GENRATED"));
      }
    );
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("USER_NOT_EXIST")
      );
    }

    try {
      let data = await User.updateOne(
        {
          _id: req.params._id,
        },
        { isDeleted: true }
      );

      if (data == null) return res.notFound({}, req.__("USER_NOT_EXIST"));

      return res.success(data, req.__("USER_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async verifyUser(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("USER_NOT_EXIST")
      );
    }

    try {
      let data = await User.updateOne(
        {
          _id: req.params._id,
        },
        { isVerified: true }
      );

      if (data == null) return res.notFound({}, req.__("USER_NOT_EXIST"));

      return res.success(data, req.__("USER_Verified_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async detail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("USER_NOT_EXIST")
      );
    }

    try {
      let data = await User.findOne(
        {
          _id: req.params._id,
          isDeleted: 0,
        },
        {
          _id: 1,
          full_name: 1,
          email: 1,
          username: 1,
          status: 1,
          is_profile_completed: 1,
          contact_number: 1,
          alternate_contact_number: 1,
          qualification: 1,
          reference: 1,
          profile_pic: 1,
          country: 1,
          state: 1,
          city: 1,
          zipcode: 1,
          zipcodes: 1,
          address: 1,
          company: 1,
          password: 1,
          unique_code: 1,
          hash: 1,
          salt: 1,
          role: 1,
          dob: 1,
          gender: 1,
          fare_amount: 1,
          owner_name: 1,
          last_seen: 1,
        }
      );
      if (data == null) return res.notFound({}, req.__("USER_NOT_EXIST"));

      return res.success(data, req.__("USER_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }
  async detailByEmail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("USER_NOT_EXIST")
      );
    }

    try {
      let data = await User.findOne(
        {
          email: req.params._id,
          isDeleted: 0,
        },
        {
          _id: 1,
          full_name: 1,
          email: 1,
          contact_numbe: 1,
          address: 1,
          username: 1,
          dob: 1,
        }
      );
      if (data == null) return res.notFound({}, req.__("USER_NOT_EXIST"));

      return res.success(data, req.__("USER_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async markProfileComplete(req, res, next) {
    let { user } = req;
    let { notificationStatus } = req.body;
    let id = user._id;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      user.isProfileCompleted = true;
      user.isNotification = notificationStatus;
      user = await user.save();
      mailer
        .sendMail(
          "account-information-updated",
          req.__("ACCOUNT_UPDATED_MAIL"),
          user.email,
          {
            name: user.name,
          }
        )
        .catch((error) => {
          logError(
            `Failed to send account information updated email to ${user.email}`
          );
          logError(error);
        });
      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      return res.success(
        {
          user: userJson,
        },
        req.__("PROFILE_UPDATED"),
        req.__("ACCOUNT_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async listAll(req, res, next) {
    /** Filteration value */

    var conditions = { isDeleted: false, isActive: 0 };
    asyncParallel(
      {
        data: function (callback) {
          User.find(
            conditions,
            {
              _id: 1,
              first_Name: 1,
              last_Name: 1,
              email: 1,
              slug: 1,
            },
            { sort: { created_at: "desc" } },
            (err, result) => {
              callback(err, result);
            }
          );
        },
      },
      function (err, results) {
        if (err) return res.json({ data: err });

        let data = {
          records: results && results.data ? results.data : [],
        };
        return res.success(data, req.__("USER_SETTING_INFORMATION"));
      }
    );
  }

  async updateProfileLanguage(req, res, next) {
    let { user } = req;
    let { languageList } = req.body;
    let id = user._id;
    try {
      let userInfo = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      userInfo.selectedLanguages = languageList;
      userInfo = await userInfo.save();
      mailer
        .sendMail(
          "account-information-updated",
          req.__("ACCOUNT_UPDATED_MAIL"),
          userInfo.email,
          {
            name: userInfo.name,
          }
        )
        .catch((error) => {
          logError(
            `Failed to send account information updated email to ${userInfo.email}`
          );
          logError(error);
        });
      const userJson = userInfo.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      return res.success({
        user: userJson,
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async updateProfile(req, res, next) {
    let { user } = req;
    let id = req.params.userID;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      let updateData = {};
      updateData.first_Name = req.body.first_Name
        ? req.body.first_Name
        : user.first_Name;

      updateData.middle_Name = req.body.middle_Name
        ? req.body.middle_Name
        : user.middle_Name;

      updateData.last_Name = req.body.last_Name
        ? req.body.last_Name
        : user.last_Name;

      updateData.photo = req.body.photo ? req.body.photo : user.photo;

      updateData.father_Name = req.body.father_Name
        ? req.body.father_Name
        : user.father_Name;

      updateData.mother_Name = req.body.mother_Name
        ? req.body.mother_Name
        : user.mother_Name;

      updateData.marital_status = req.body.marital_status
        ? req.body.marital_status
        : user.marital_status;

      updateData.religion = req.body.religion
        ? req.body.religion
        : user.religion;

      updateData.minority = req.body.minority
        ? req.body.minority
        : user.minority;

      updateData.disability_status = req.body.disability_status
        ? req.body.disability_status
        : user.disability_status;

      updateData.body_mark = req.body.body_mark
        ? req.body.body_mark
        : user.body_mark;

      await User.findOneAndUpdate({ _id: id, isDeleted: false }, updateData);

      return res.success(
        {
          user: {},
        },
        req.__("PROFILE_UPDATED"),
        req.__("ACCOUNT_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async updateAddress(req, res, next) {
    let { user } = req;
    let id = req.params.userID;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      let updateData = {};
      user.resident_of_rajasthan = req.body.resident_of_rajasthan;

      user.home_district = req.body.home_district;

      user.home_state = req.body.home_state;

      user.nationality = req.body.nationality;

      user.permanent_address = req.body.permanent_address;

      user.corresponding_address = req.body.corresponding_address;
      user.step_completed = 1;

      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      await user.save();
      return res.success(
        {
          user: userJson,
        },
        req.__("PROFILE_ADDRESS_UPDATED"),
        req.__("ACCOUNT_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async updateEducation(req, res, next) {
    let { user } = req;
    let id = req.params.userID;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      let updateData = {};
      let isIllitrate = req.body.education_qualification?.illitrate;
      console.log("is illitrate", isIllitrate);
      if (!isIllitrate) {
        console.log("inside illitrate", req.body);
        if (req.body?.education_qualification?.secondary?.board_name) {
          user.education_qualification.secondary = req.body
            .education_qualification.secondary
            ? req.body.education_qualification.secondary
            : {};
        }

        if (req.body?.education_qualification?.senior_secondary?.board_name) {
          user.education_qualification.senior_secondary =
            req.body.education_qualification.senior_secondary;
        }

        user.education_qualification.diploma =
          req.body.education_qualification.diploma;

        if (req.body?.education_qualification?.graduation?.university_name) {
          user.education_qualification.graduation =
            req.body.education_qualification.graduation;
        }

        if (
          req.body?.education_qualification?.post_graduation?.university_name
        ) {
          user.education_qualification.post_graduation =
            req.body.education_qualification.post_graduation;
        }

        user.education_qualification.technical_qualification =
          req.body.education_qualification.technical_qualification;

        user.education_qualification.other_qualifications =
          req.body.education_qualification.other_qualifications;

        if (req.body?.education_qualification?.skill_training?.type_of_skill) {
          user.education_qualification.skill_training =
            req.body.education_qualification.skill_training;
        }
      }
      user.soft_skills = req.body?.soft_skills ? req.body?.soft_skills : [];
      user.hard_skills = req.body?.hard_skills ? req.body?.hard_skills : [];

      user.step_completed = 2;

      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      await user.save();
      return res.success(
        {
          user: userJson,
        },
        req.__("PROFILE_EDUCATION_UPDATED"),
        req.__("ACCOUNT_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async updateExperience(req, res, next) {
    let { user } = req;
    let id = req.params.userID;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      let updateData = {};

      user.experience = req.body?.experience ? req.body?.experience : [];

      user.step_completed = 3;

      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      await user.save();
      return res.success(
        {
          user: userJson,
        },
        req.__("PROFILE_EXPERIENCE_UPDATED"),
        req.__("ACCOUNT_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async updateDocuments(req, res, next) {
    let { user } = req;
    let id = req.params.userID;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      let updateData = {};

      user.documents.government_ID = req.body.documents.government_ID
        ? req.body.documents.government_ID
        : user.documents.government_ID;

      user.documents.signature = req.body.documents.signature
        ? req.body.documents.signature
        : user.documents.signature;

      user.documents.other_certificate = req.body.documents.other_certificate
        ? req.body.documents.other_certificate
        : user.documents.other_certificate;

      user.step_completed = 4;

      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      await user.save();
      return res.success(
        {
          user: userJson,
        },
        req.__("PROFILE_DOCUMENTS_UPDATED"),
        req.__("ACCOUNT_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  // async changeStatus(req, res, next) {
  //   let user = req;
  //   //console.log("user.params",req.params._id)
  //   let id = req.params._id;
  //   try {
  //     user = await User.findOne({
  //       _id: id,
  //       isDeleted: false,
  //     });

  //     if (!user) {
  //       return res.notFound(
  //         {},
  //         req.__("INVALID_REQUEST"),
  //         req.__("USER_NOT_EXIST")
  //       );
  //     }

  //     let updateData = {};
  //     updateData.isActive = !user.isActive;
  //     let responseData = await User.findOneAndUpdate(
  //       {
  //         _id: id,
  //       },
  //       updateData,
  //       { upsert: false, new: true }
  //     );
  //     return res.success(
  //       {
  //         user: userJson,
  //       },
  //       req.__("PROFILE_STATUS_UPDATED"),
  //       req.__("ACCOUNT_STATUS_UPDATED")
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     return next(err);
  //   }
  // }
  async UpdateStatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("User_NOT_EXIST")
      );
    }

    try {
      let data = await User.findOne({
        _id: req.params._id,
      });
      if (data == null) return res.notFound({}, req.__("User_NOT_EXIST"));

      let updatedData = await User.updateOne(
        {
          _id: req.params._id,
        },
        {
          $set: {
            isActive: data.isActive == 1 ? 0 : 1,
          },
        }
      );

      return res.success(data, req.__("USER_STATUS_UPDATE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async block(req, res, next) {
    let user = req;
    //console.log("user.params",req.params._id)
    let id = req.params._id;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      let updateData = {};
      updateData.isSuspended = !user.isSuspended;
      let responseData = await User.findOneAndUpdate(
        {
          _id: id,
        },
        updateData,
        { upsert: false, new: true }
      );

      const userJson = responseData.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      return res.success(
        {
          user: userJson,
        },
        req.__("PROFILE_SUSPENTION_UPDATED"),
        req.__("ACCOUNT_SUSPENTION_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async filterdropdown(req, res, next) {
    var conditions = { isDeleted: 0, isActive: 0, isSuspended: false };

    if (req.query.role) {
      conditions.role = req.query.role;
    }

    console.log("conditions", conditions);
    asyncParallel(
      {
        data: function (callback) {
          User.find(
            conditions,
            {
              _id: 1,
              first_Name: 1,

              is_edit: 1,

              // created_at: 1,
              // modified_at: 1,
            },
            { sort: { created_at: "desc" } },
            (err, result) => {
              callback(err, result);
            }
          );
        },
      },
      function (err, results) {
        if (err) return res.json({ data: err });

        let data = {
          records: results && results.data ? results.data : [],
        };
        return res.success(data, req.__("VALID_USER"));
      }
    );
  }

  async updateDestination(req, res, next) {
    let { user } = req;
    let location = req.body;
    let id = user._id;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      if (user.currentLocation.created != "") {
        //--------storing lat & long------------
        user.previousLocation.latitude = user.currentLocation.latitude;
        user.previousLocation.longitude = user.currentLocation.longitude;

        user.previousLocation.location.coordinates = [
          user.currentLocation.longitude,
          user.currentLocation.latitude,
        ];
        user.previousLocation.placemark = user.currentLocation.placemark;
        user.previousLocation.address = user.currentLocation.address;
        user.previousLocation.deviceTime = user.currentLocation.deviceTime;
        user.previousLocation.created = user.currentLocation.created;
      }
      //--------storing lat & long------------
      user.currentLocation.latitude = location.latitude;
      user.currentLocation.longitude = location.longitude;
      user.currentLocation.location.coordinates = [
        location.longitude,
        location.latitude,
      ];
      user.currentLocation.placemark = location.placemark;
      user.currentLocation.address = location.address;
      user.currentLocation.deviceTime = location.deviceTime;
      user.currentLocation.created = Date.now();
      user.locationSharing = location.locationSharing;

      user = await user.save();
      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      userJson.isDefaultLocation = false;
      return res.success(
        {
          user: userJson,
        },
        req.__("PROFILE_UPDATED"),
        req.__("ACCOUNT_UPDATED")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async getNearByList(req, res, next) {
    let { user } = req;
    let id = user._id;
    try {
      user = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }

      // var givenLocation = [req.body.longitude, req.body.latitude]
      // var query = {
      //   'currentLocation.location': {
      //     geo: {
      //       $near: {
      //         $geometry: {
      //           type: "Point",
      //           coordinates: givenLocation
      //         },
      //         spherical: true,
      //         $maxDistance: req.body.radius
      //       },
      //     }
      //   }
      // };

      // query._id = { $ne: id };
      // query.isDeleted = { $eq: false };
      // query.isVerified = { $eq: true };
      // let nearbyList = await User.find(query);
      let nearbyList = await User.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [req.body.longitude, req.body.latitude],
            },
            distanceField: "dist.calculated",
            key: "currentLocation.location",
            maxDistance: req.body.radius,
            query: { _id: { $ne: id } },
            includeLocs: "currentLocation.location",
          },
        },
      ]);
      const userJson = nearbyList;
      return res.success({
        user: userJson,
      });
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
    return res.success(userJson, req.__("SETTING_INFORMATION"));
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
