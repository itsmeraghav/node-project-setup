const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const requireId = Joi.object().keys({
  id: Joi.objectId()
    .valid()
    .optional()
    .allow(""),
});

const updatePassword = Joi.object().keys({
  currentPassword: Joi.string().required(),
  //newPassword: common.password,
  newPassword: Joi.string()
    .min(8)
    .max(20)
    .required(),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .error(([error]) => {
      const { locale } = error.options;
      const language = languages[locale];
      return {
        message: language.validation.custom.sameAs(
          error.context.key,
          "newPassword"
        ),
      };
    }),
});

const addTopic = Joi.object().keys({
  topicId: Joi.objectId()
    .valid()
    .required(),
  subTopicId: Joi.objectId()
    .valid()
    .required(),
  status: Joi.boolean().required(),
  //.valid(['active', 'inactive']),
  level: Joi.string()
    .required()
    .valid(["advanced", "novice"]),
});

// const updateProfile = Joi.object().keys({
//   photo: Joi.string().required(),
//   first_Name: Joi.string().required(),
//   middle_Name: Joi.optional(),
//   last_Name: Joi.string().required(),
//   father_Name: Joi.string().required(),
//   mother_Name: Joi.string().required(),
//   minority: Joi.boolean().required(),
//   religion: Joi.string().required(),
//   disability_status: Joi.string().required(),
//   body_mark: Joi.string().required(),
//   marital_status: Joi.string().required(),
// });

const updateaddress = Joi.object().keys({
  resident_of_rajasthan: Joi.boolean().required(),
  nationality: Joi.string().required(),
  home_district: Joi.string().required(),
  home_state: Joi.string().required(),
  permanent_address: Joi.object().required(),
  corresponding_address: Joi.object().required(),
});

const updateEducation = Joi.object().keys({
  education_qualification: Joi.object().optional(),
  soft_skills: Joi.array().optional(),
  hard_skills: Joi.array().optional(),
});

const updateExperience = Joi.object().keys({
  experience: Joi.array().optional(),
});

const updatedocument = Joi.object().keys({
  documents: Joi.object().optional(),
});

const updateDestination = Joi.object().keys({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  deviceTime: Joi.number().optional(),
  placemark: Joi.string().required(),
  address: Joi.string().required(),
  locationSharing: Joi.boolean().required(),
});

const getNearByList = Joi.object().keys({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  radius: Joi.number().required(),
});

const profileComplete = Joi.object().keys({
  notificationStatus: Joi.boolean().required(),
});

module.exports = {
  requireId,
  updatePassword,
  addTopic,
  // updateProfile,
  updateDestination,
  getNearByList,
  profileComplete,
  updateaddress,
  updateEducation,
  updateExperience,
  updatedocument,
};
