const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const createtype = Joi.object().keys({
    title: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .required(),
    type: Joi.number()
        .required(),
    });

    const updateProfile = Joi.object().keys({
        title: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
            .optional(),
        type: Joi.number()
            .optional(),
    });



module.exports = {
   
     createtype,
    updateProfile,
    
};
