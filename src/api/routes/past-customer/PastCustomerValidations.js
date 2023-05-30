const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const create = Joi.object().keys({
    to_id: Joi.string().required(),
    from_id: Joi.string().required(),

    date: Joi.date().optional(),
    description: Joi.string().optional(),
    rating: Joi.number().optional(),


  });
   
  module.exports = {
    create,
  };
  