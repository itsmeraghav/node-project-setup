const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const create = Joi.object().keys({
  user_id: Joi.string().optional(),
  weekly_speciality: Joi.objectId().optional(),
  start: Joi.string().required(),
  end: Joi.string().required(),
  availability: Joi.array().required(),

});

module.exports = {
  create,
};
