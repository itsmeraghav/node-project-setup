const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const create = Joi.object().keys({
  set_distance_unit: Joi.string().required(),
});

const updateDistanceUnit = Joi.object().keys({
  name: Joi.string().optional(),
});

module.exports = {
  create,
  updateDistanceUnit,
};
