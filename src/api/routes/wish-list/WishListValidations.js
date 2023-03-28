const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const create = Joi.object().keys({
  name: Joi.string().required(),
  item_name: Joi.string().required(),
});

const updateWishList = Joi.object().keys({
  name: Joi.string().optional(),
  item_name: Joi.string().optional(),
});

module.exports = {
  create,
  updateWishList,
};
 