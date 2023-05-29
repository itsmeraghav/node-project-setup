const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const createtype = Joi.object().keys({
  //newPassword: common.password,
  list_title: Joi.string().optional(),
  description: Joi.string().optional(),
  item: Joi.string().optional(),
  minimum_quantity: Joi.number().optional(),
  unit: Joi.string().optional(),
  quantity: Joi.number().optional(),
  item_photo: Joi.string().optional(),
  total: Joi.number().optional(),
  user_id: Joi.objectId().optional(),
  included_items: Joi.array().optional(),
  price_of_minimum_quantity: Joi.number().optional(),


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
