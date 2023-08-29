const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

// const create = Joi.object().keys({
//   dish_id: Joi.string().required(),

// });

// const updateFollowersfollowing = Joi.object().keys({
//   image: Joi.string().optional(),

// });

module.exports = {
  create,
  updateFollowersfollowing,
};
