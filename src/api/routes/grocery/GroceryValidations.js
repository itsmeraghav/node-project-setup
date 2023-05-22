const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const createtype = Joi.object().keys({
  //newPassword: common.password,
  list_title: Joi.string().required(),
  description: Joi.string().required(),
  item: Joi.string().required(),
  minimum_quantity: Joi.number().required(),
  unit: Joi.string().required(),
  quantity: Joi.number().required(),
  item_photo: Joi.string().optional(),
  total: Joi.number().required(),
});

 const updateProfile = Joi.object().keys({
    list_title: Joi.string().optional(),
    description: Joi.string().optional(),
    item: Joi.string().optional(),
    minimum_quantity: Joi.number().optional(),
    unit: Joi.string().optional(),
    quantity: Joi.number().optional(),
    item_photo: Joi.string().optional(),
    total: Joi.number().optional(),
 });

module.exports = {
  createtype,
     updateProfile
};
