const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const create = Joi.object().keys({
  image: Joi.string().required(),
  
});

const updateFavouriteDish = Joi.object().keys({
  image: Joi.string().optional(),
  
});

module.exports = {
  create,
  updateFavouriteDish,
};
