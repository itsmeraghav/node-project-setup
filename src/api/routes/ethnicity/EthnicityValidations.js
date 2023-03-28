const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');


const createtype = Joi.object().keys({
    name: Joi.string().required(),
   
  });

  const updateProfile = Joi.object().keys({
    name: Joi.string().optional(),
   
 });
  
module.exports = {
    createtype,
    updateProfile
};
