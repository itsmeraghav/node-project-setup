const { Joi, common } = require("../../util/validations");
const { languages } = require("../../../../lib/i18n");

const createdish = Joi.object().keys({
  dish_title: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
  description: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
  ingredients: Joi.string().required(),
  tags: Joi.string().optional(),
  preparation_time: Joi.string().required(),
  dish_photo: Joi.string().optional(),
  cost: Joi.number().required(),
  user_id: Joi.string().required(),
});

const updateProfile = Joi.object().keys({
  dish_title: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),
  description: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),
  ingredients: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),
  tags: Joi.string().optional(),
  preparation_time: Joi.string().optional(),
  dish_photo: Joi.string().optional(),
  cost: Joi.number().optional(),
});

module.exports = {
  createdish,
  updateProfile,
};
