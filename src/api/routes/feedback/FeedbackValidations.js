const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const create = Joi.object().keys({
    name: Joi.string().required(),
    designation: Joi.string().optional(),
    date: Joi.date().optional(),
  });
   
  module.exports = {
    create,
  };
  