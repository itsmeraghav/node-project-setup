const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const create = Joi.object().keys({
  user_id: Joi.string().required(),
  weekly_speciality: Joi.objectId().optional(),
  start: Joi.string().required(),
  end: Joi.string().required(),
});

module.exports = {
  create,
};
