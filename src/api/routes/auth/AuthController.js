const {
  models: { User, Otp, Language, Page },
} = require("../../../../lib/models");
const mailer = require("../../../../lib/mailer");
const axios = require("axios");
//const sms = require('../../../../lib/sms');
const { signToken } = require("../../util/auth");
const { signTempToken } = require("../../util/auth");
const { randomuniqe, randomAlphabetic } = require("../../util/common");
const {
  utcDateTime,
  generateOtp,
  logError,
  randomString,
  createS3SingnedUrl,
} = require("../../../../lib/util");
var _ = require("lodash");
const jwtToken = require("jsonwebtoken");

var SendGridKey = process.env.SENDGRID_API_KEY;
var apiEnv = process.env.NODE_ENV;
console.log("this is env:", apiEnv);
var moment = require("moment");

class AuthController {
  async logIn(req, res, next) {
    try {
      const { email, password, deviceToken } = req.body;
      let user;
      const platform = req.headers["x-testing-platform"];

      user = await User.findOne({
        $or: [
          {
            email: email,
          },
          {
            contact_number: email,
          },
          {
            unique_user_id: email,
          },
        ],
      }).populate("role", "name");
      if (!user) {
        return res.notFound(
          {},
          req.__("USER_LOGIN_ERROR"),
          req.__("INCORRECT_EMAIL_PASSWORD")
        );
      }

      const passwordMatched = await user.comparePassword(password);
      if (!passwordMatched) {
        return res.warn(
          {},
          req.__("USER_LOGIN_ERROR"),
          req.__("INCORRECT_EMAIL_PASSWORD")





          
        );
      }

      // if (!user.isVerified) {
      //   let otpAdded = await Otp.findOne({ email, otpType: 'SIGNUP' });
      //   if ((otpAdded && !otpAdded.isVerified) || !otpAdded) {
      //     let otpData;
      //     if (otpAdded && !otpAdded.isVerified) {
      //       otpData = otpAdded;
      //     } else {
      //       otpData = new Otp();
      //     }

      //     let otpCode = generateOtp();
      //     otpData.otp = otpCode;
      //     otpData.email = email;
      //     otpData.otpType = "SIGNUP";
      //     otpData.isVerified = false;
      //     otpData.otpTokenIssuedAt = utcDateTime().valueOf();
      //     await otpData.save();

      //     mailer
      //       .sendMail("email-verify", "Please Verify Your testing Account", email, {
      //         name: user.fullName.charAt(0).toUpperCase() + user.fullName.slice(1),
      //         verification_code: otpCode,
      //       })
      //       .catch((error) => { });
      //   }

      //   return res.warn(
      //     { userId: user._id, emailVerified: user.isVerified },
      //     req.__("EMAIL_SEND"), req.__("LOGIN_VERIFICATION_EMAIL_SENT")
      //   );
      // }

      user.authTokenIssuedAt = utcDateTime().valueOf();
      user.deviceToken = deviceToken;
      if (user.isSuspended) {
        return res.warn(
          {
            userId: user._id,
            adminVerified: !user.isSuspended,
            isSuspended: user.isSuspended,
          },
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }
      if (user.isDeleted) {
        return res.warn(
          {
            userId: user._id,
            adminVerified: !user.isSuspended,
            isSuspended: user.isSuspended,
          },
          req.__("YOUR_ACCOUNT_DELETED"),
          req.__("ACCOUNT_DELETED")
        );
      }
      await user.save();
      const token = signToken(user, platform);
      const userJson = user.toJSON();
      [
        "full_name",
      "email",
      "username",
      "status",
      "is_profile_completed",
      "contact_number",
      "alternate_contact_number",
      "qualification",
      "reference",
      "profile_pic",
      "country",
      "state",
      "city",
      "zipcode",
      "zipcodes",
      "address",
      "company",
      "password",
      "unique_code",
      "hash",
      "salt",
      "role",
      "dob",
      "gender",
      "fare_amount",
      "owner_name",
      "last_seen",
      ].forEach((key) => delete userJson[key]);
      return res.success(
        {
          token,
          user: userJson,
          baseProfileUrl: process.env.AWS_S3_BASE,
        },
        req.__("LOGIN_SUCCESS")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async generateToken(req, res) {
    let _id = req.params._id;
    const user = await User.findOne({ _id });
    let platform = req.headers["x-testing-platform"];
    user.authTokenIssuedAt = utcDateTime().valueOf();
    await user.save();
    const token = signToken(user, platform);
    return res.success({
      token,
    });
  }

  async logOut(req, res) {
    const { user } = req;
    user.authTokenIssuedAt = null;
    user.deviceToken = null;
    await user.save();
    return res.success({}, req.__("LOGOUT_SUCCESS"));
  }

  async verifyOtp(req, res) {
    let { otp, otpType, contact_number, deviceToken } = req.body;
    const time = utcDateTime().valueOf() - 900000;

    const otpObj = await Otp.findOne({
      contact_number,
      otp,
      otpType,
      otpTokenIssuedAt: { $gt: time },
    });

    if (!otpObj)
      return res.warn({}, req.__("INVALID_OTP"), req.__("INCORRECT_PASSCODE"));
    //
    await Otp.findOneAndUpdate(
      { contact_number, otp },
      { $set: { isVerified: true } }
    );
    if (otpType == "FORGOT") {
      let user = await User.findOne({
        email,
        isDeleted: false,
        //isVerified: true,
      });
      /* if(user && !user.isVerified){
        return res.warn({}, req.__("ACCOUNT_NOT_VERIFIED"), req.__("UNVERIFIED"));
      } */
      if (user) {
        const resetPasswordToken = randomAlphabetic(18);
        user.resetPasswordToken = resetPasswordToken;
        await user.save();
        return res.success(
          { resetToken: resetPasswordToken },
          req.__("USER_VERIFIED")
        );
      }
    } else if (otpType == "EDIT") {
      let user = await User.findOne({
        email,
        isDeleted: false,
        isVerified: true,
      });
      if (user) {
        const resetPasswordToken = randomAlphabetic(18);
        user.resetPasswordToken = resetPasswordToken;
        await user.save();

        return res.success(resetPasswordToken, req.__("USER_VERIFIED"));
      }
    } else if (otpType == "SIGNUP") {
      await User.findOneAndUpdate(
        { contact_number, isDeleted: false },
        { $set: { isVerified: true } }
      );

      return res.success({}, "", req.__("OTP_VERIFIED"));
    } else if (otpType == "LOGIN") {
      await User.findOneAndUpdate(
        { contact_number, isDeleted: false },
        { $set: { isVerified: true } }
      );
    }
    res.success({}, "", req.__("OTP_VERIFIED"));
  }

  async resendOtp(req, res, next) {
    let { email, otpType } = req.body;
    try {
      let otpAdded = await Otp.findOne({ email, otpType });
      let otpData;
      let otpCode = generateOtp();
      if (otpAdded) {
        otpData = otpAdded;
      } else {
        otpData = new Otp();
      }
      otpData.otp = otpCode;
      otpData.email = email;
      otpData.otpType = otpType;
      otpData.isVerified = false;
      otpData.otpTokenIssuedAt = utcDateTime().valueOf();
      await otpData.save();
      let user = await User.findOne({ email });
      if (user) {
        user.isVerified = false;
        await user.save();
      }

      // mailer.sendMail("resend-code", "Please Verify Your testing Account", user.email, {
      mailer
        .sendMail(
          "email-verify",
          "Please Verify Your testing Account",
          user.email,
          {
            name:
              user.full_Name.charAt(0).toUpperCase() +
              user.full_Name.slice(1),
            verification_code: otpCode,
          }
        )
        .catch((error) => {
          logError(`Failed to send mail ${user.email}`);
          logError(error);
        });
      return res.success(
        {},
        req.__("EMAIL_SEND"),
        req.__("VERIFICATION_EMAIL_SENT")
      );
    } catch (err) {
      return next(err);
    }
  }

  async SendOtp(req, res, next) {
    let { contact_number, otpType } = req.body;

    let user = await User.findOne({
      contact_number: contact_number,
      isDeleted: false,
    });
    if (!user) {
      return res.warn({}, req.__("USER_NOT_EXIST"), req.__("USER_NOT_EXIST"));
    }

    if (user.isVerified) {
      return res.warn(
        {},
        req.__("ACCOUNT_ALLREADY_VERIFIED"),
        req.__("VERIFIED")
      );
    }
    try {
      // let otpCode = generateOtp();
      let otpCode = 1234;
      let otpData = new Otp();
      otpData.otp = otpCode;
      otpData.contact_number = contact_number;
      otpData.otpType = otpType;
      otpData.isVerified = false;
      otpData.otpTokenIssuedAt = utcDateTime().valueOf();
      await otpData.save();
      //send otp to contact number

      let name = user?.full_Name;
      let otp = otpCode;
      return res.success({}, req.__("OTP_SEND"), req.__("OTP_SEND"));
      // axios
      //   .get(
      //     `http://india.jaipurbulksms.com/api/mt/SendSMS?user=quicksilver&password=zapak123&senderid=RJSEEL&channel=Trans&DCS=0&flashsms=0&number=${contact_number}&text=Dear ${name}, OTP to complete your RAJSEEL Registration is ${otp}. RAJSEEL&route=3&dlttemplateid=1707167084320201171&telemarketerid=1702157752508090199##&peid=1701161484178058400`
      //   )
      //   .then((response) => {
      //     //
      //     return res.success(
      //       {},
      //       req.__("OTP_SEND"),
      //       req.__("VERIFICATION_contact_NUMBER_DONE")
      //     );
      //   });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @param {full_name, email, password, confirmPassword, deviceToken} req
   * @param {*} res
   * @param {*} next
   */
  async signup(req, res, next) {
    let {
      full_name,
      email,
      username,
      status,
      is_profile_completed,
      contact_number,
      alternate_contact_number,
      qualification,
      reference,
      profile_pic,
      country,
      state,
      city,
      zipcode,
      zipcodes,
      address,
      company,
      password,
      unique_code,
      hash,
      salt,
      role,
      dob,
      gender,
      fare_amount,
      owner_name,
      last_seen
    } = req.body;
    try {
      let x = await User.findOne({ email, isDeleted: false });

      if (x) {
        return res.warn(
          {},
          req.__("EMAIL_EXISTS"),
          req.__("EMAIL_ALREADY_REGISTERED")
        );
      }

      let y = await User.findOne({ contact_number, isDeleted: false });

      if (y) {
        return res.warn(
          {},
          req.__("CONTACT_NUMBER_EXISTS"),
          req.__("CONTACT_NUMBER_ALREADY_REGISTERED")
        );
      }

      let z = await User.findOne({ username, isDeleted: false });

      if (z) {
        return res.warn(
          {},
          req.__("USERNAME_EXISTS"),
          req.__("USERNAME_ALREADY_REGISTERED")
        );
      }

      if (password !== confirmPassword) {
        return res.warn(
          {},
          req.__("CONFIRM_PASSWORD_IS_NOT_SAME"),
          req.__("PASSWORD_NOT_SAME")
        );
      }

      let user = new User();
      const platform = req.headers["x-testing-platform"];
      user.full_name = full_name;
      user.email = email ;
      user.username = username;
      user.is_profile_completed = is_profile_completed;
      user. status = status;
      user.contact_number = contact_number;
      user.alternate_contact_number = alternate_contact_number;
      user. qualification = qualification ;
      user.reference = reference;
      user.profile_pic = profile_pic;
      user.country = country;
      user.state= state;
      user.city = city;
      user.zipcode= zipcode;
      user.zipcodes = zipcodes;
      user. address = address;
      user. company = company;
      user.password = password;
      user.unique_code = unique_code;
      user.hash = hash;
      user.salt = salt;
      user.role =role ;
      user.dob = dob;
      user.gender = gender;
      user.fare_amount = fare_amount;
      user.owner_name = owner_name;
      user.last_seen = last_seen;
      
      user.isVerified = false;
      user.unique_user_id = randomuniqe(10);

      user = await user.save();
      return res.success(user, req.__("USER_SIGNUP"));
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async languageList(req, res, next) {
    const { user } = req;
    let languagesList = await Language.find({
      status: "active",
      isDeleted: false,
    })
      .sort({ name: 1 })
      .lean();

    let languages = [];
    let suggestedLanguages = [];
    languagesList = languagesList.map((i) => {
      return user.selectedLanguages.indexOf(i._id) !== -1
        ? {
            ...i,
            isSelected: true,
          }
        : { ...i, isSelected: false };
    });

    suggestedLanguages = languagesList.filter((item) => item.order == 1);
    languages = languagesList.filter((item) => item.order == 2);
    let finalData = [
      { languages: suggestedLanguages },
      { languages: languages },
    ];
    return res.success(finalData);
  }

  async forgotPassword(req, res, next) {
    let { email } = req.body;
    
    try {
      let user = await User.findOne({
        email,
        isDeleted: false,
        signUpType: "normal",
        isSuspended: false,
      });
      const platform = req.headers["x-testing-platform"];
      if (!user) {
        return res.success(
          {},
          req.__("EMAIL_SEND"),
          req.__("VERIFICATION_EMAIL_SENT")
        ); //As per Document if email not found also send same response
      }

      let otpAdded = await Otp.findOne({ email, otpType: "FORGOT" });
      let otpData;
      if (otpAdded) {
        otpData = otpAdded;
      } else {
        otpData = new Otp();
      }
      let otpCode = generateOtp();
      otpData.otp = otpCode;
      otpData.email = email;
      otpData.otpType = "FORGOT";
      otpData.isVerified = false;
      otpData.otpTokenIssuedAt = utcDateTime().valueOf();
      await otpData.save();
      mailer
        .sendMail(
          "api-forgot-password",
          "Update Your testing Password",
          email,
          {
            name:
              user.full_Name.charAt(0).toUpperCase() +
              user.full_Name.slice(1),
            verification_code: otpCode,
          }
        )
        .catch((error) => {});
      return res.success(
        {},
        req.__("EMAIL_SEND"),
        req.__("VERIFICATION_EMAIL_SENT")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;
    let user = await User.findOne({
      email,
      resetPasswordToken: token,
      isDeleted: false,
    });
    if (user) {
      if (!user.isVerified) {
        let otpAdded = await Otp.findOne({ email, otpType: "SIGNUP" });
        if ((otpAdded && !otpAdded.isVerified) || !otpAdded) {
          let otpData;
          if (otpAdded && !otpAdded.isVerified) {
            otpData = otpAdded;
          } else {
            otpData = new Otp();
          }

          let otpCode = generateOtp();
          otpData.otp = otpCode;
          otpData.email = email;
          otpData.otpType = "SIGNUP";
          otpData.isVerified = false;
          otpData.otpTokenIssuedAt = utcDateTime().valueOf();
          await otpData.save();

          mailer
            .sendMail(
              "email-verify",
              "Please Verify Your testing Account",
              email,
              {
                name:
                  user.fullName.charAt(0).toUpperCase() +
                  user.fullName.slice(1),
                verification_code: otpCode,
              }
            )
            .catch((error) => {});
        }

        return res.warn(
          { userId: user._id, emailVerified: user.isVerified },
          req.__("EMAIL_SEND"),
          req.__("LOGIN_VERIFICATION_EMAIL_SENT")
        );
      }
    }
    if (!user) {
      return res.badRequest(
        {},
        req.__("USER_NOT_EXISTS"),
        req.__("USER_NOT_EXIST")
      );
    }
    //const resetPasswordToken = randomAlphabetic(18);
    user.resetPasswordToken = "";
    user.password = password;
    user.isVerified = true;
    const userSave = await user.save();
    mailer
      .sendMail("password-update", req.__("PASSWORD_UPDATED"), user.email, {
        name: user.full_Name,
      })
      .catch((error) => {
        logError(`Failed to send password password email to ${user.email}`);
        logError(error);
      });

    if (!userSave) return res.badRequest({}, req.__("PASSWORD_NOT_SAVED"), "");

    res.success({}, req.__("PASSWORD_RESET"), req.__("PASSWORD_UPDATED"));
  }

  async changePassword(req, res) {
    const { password, oldPassword } = req.body;
    const { _id } = req.user;

    let user = await User.findOne({
      _id,
      isDeleted: false,
      isVerified: true,
    });
    if (!user) {
      return res.badRequest({}, req.__("USER_NOT_EXISTS"));
    }
    const passwordMatched = await user.comparePassword(oldPassword);
    if (!passwordMatched) {
      return res.warn({}, req.__("CURRENT_PASSWORD_NOT_MATCH"));
    }
    user.password = password;
    const userSave = await user.save();
    mailer
      .sendMail("password-update", req.__("PASSWORD_UPDATED"), user.email, {
        name: user.full_Name,
      })
      .catch((error) => {
        logError(`Failed to send password password email to ${user.email}`);
        logError(error);
      });

    if (!userSave) return res.badRequest({}, req.__("NOT_SAVED"));

    res.success({}, req.__("PASSWORD_CHANGED"));
  }

  async logOut(req, res) {
    const { user } = req;
    user.authTokenIssuedAt = null;
    user.deviceToken = null;
    await user.save();
    return res.success({}, req.__("LOGOUT_SUCCESS"));
  }

  async socialLogin(req, res, next) {
    try {
      var { socialType, socailId, deviceToken } = req.body;
      socialType = socialType.toLowerCase();

      const platform = req.headers["x-testing-platform"];
      let user = await User.findOne({
        socialType: socialType,
        socailId: socailId,
        isDeleted: false,
      });
      if (!user) {
        return res.notFound({}, req.__("USER_LOGIN_ERROR"));
      }

      user.authTokenIssuedAt = utcDateTime().valueOf();
      user.deviceToken = deviceToken;
      if (user.isSuspended) {
        return res.warn(
          { userId: user._id, adminVerified: !user.isSuspended },
          req.__("YOUR_ACCOUNT_SUSPENDED")
        );
      }

      await user.save();
      const token = signToken(user, platform);
      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      return res.success(
        {
          token,
          user: userJson,
          baseProfileUrl: process.env.AWS_S3_BASE,
        },
        req.__("LOGIN_SUCCESS")
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async updateNotification(req, res, next) {
    let { user } = req;
    let { notificationStatus } = req.body;
    let id = user._id;
    console.log("notificationStatus=======>", notificationStatus);
    try {
      let userInfo = await User.findOne({
        _id: id,
        isDeleted: false,
      });

      userInfo.isNotification = notificationStatus;
      userInfo.notificationDate = Date.now();
      userInfo.isPremissionGranted = true;
      userInfo = await userInfo.save();
      /* mailer.sendMail('account-information-updated', req.__('ACCOUNT_UPDATED'), userInfo.email, {
        name: userInfo.name
      }).catch((error) => {
        logError(`Failed to send account information updated email to ${userInfo.email}`);
        logError(error);
      });*/
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

  async socialSignup(req, res, next) {
    var {
      socialType,
      socailId,
      email,
      full_Name,
      deviceToken,
      deviceType,
    } = req.body;
    socialType = socialType.toLowerCase();
    const platform = req.headers["x-testing-platform"];
    console.log("platform------------->", platform);
    try {
      if (email) {
        let x = await User.findOne({ email, isDeleted: false });
        if (x) {
          return res.warn({}, req.__("EMAIL_EXISTS"));
        }
      } else {
        let user = await User.findOne({
          socialType,
          socailId,
          isDeleted: false,
        });
        if (user) {
          user.authTokenIssuedAt = utcDateTime().valueOf();
          user.deviceToken = deviceToken;
          if (user.isSuspended) {
            return res.warn(
              { userId: user._id, adminVerified: !user.isSuspended },
              req.__("YOUR_ACCOUNT_SUSPENDED")
            );
          }

          await user.save();
          const token = signToken(user, platform);
          const userJson = user.toJSON();
          ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
            (key) => delete userJson[key]
          );
          return res.success(
            {
              token,
              user: userJson,
              baseProfileUrl: process.env.AWS_S3_BASE,
            },
            req.__("LOGIN_SUCCESS")
          );
        }
      }
      console.log("============------->");
      let user = new User();
      user.name = full_Name;
      user.email = email || "";
      user.deviceType = deviceType || "ios";
      user.isVerified = true;
      user.socialType = socialType;
      user.socailId = socailId;
      user.signUpType = "apple";
      user = await user.save();

      user.authTokenIssuedAt = utcDateTime().valueOf();
      user.deviceToken = deviceToken;
      await user.save();

      const token = signToken(user, platform);
      const userJson = user.toJSON();
      ["password", "authTokenIssuedAt", "otp", "emailToken", "__v"].forEach(
        (key) => delete userJson[key]
      );
      if (email) {
        mailer
          .sendMail("welcome-email", req.__("WELCOME_EMAIL"), email, {
            name: full_Name,
          })
          .catch((error) => {
            logError(`Failed to send welcome email to ${email}`);
            logError(error);
          });
      }

      return res.success({
        token,
        user: userJson,
        baseProfileUrl: process.env.AWS_S3_BASE,
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async testA(req, res, next) {
    sms
      .sendSms("tter", "sdfdfd", "otp")
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => {
        return res.warn(" ", req.__("SMS_NOT_SENT"));
      });
  }

  async staticPage(req, res) {
    const result = await Page.findOne({
      slug: req.params.slug,
      isSuspended: false,
    });
    const allPages = await Page.find({ isSuspended: false });

    console.log("=================================", result);
    return res.render("pages", {
      allPages: allPages,
      title: result.title ? result.title : "",
      page: result.slug ? result.slug : "",
      description: result.description ? result.description : "",
    });
  }
}

module.exports = new AuthController();
