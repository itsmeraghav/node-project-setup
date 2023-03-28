const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const createRole= Joi.object().keys({
    //newPassword: common.password,
    name: Joi.string()
    .required(),   
       
});

const updateProfile = Joi.object().keys({
    name: Joi.string()
    .optional(),
});


module.exports = {
    createRole,
    updateProfile,
   
};
