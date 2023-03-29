const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const createAboutMe = Joi.object().keys({
    username: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .required(),
        email: common.email,
        contact_number: Joi.number()
        .required(),
        zipcode: Joi.string()
        .required(),
        address: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .required(),
        country: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)  
        .required(),
        state: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .required(),
        city: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .required(),
        gender: Joi.string().required(),
        dob:Joi.date().required()
    });


    const updateAboutMe = Joi.object().keys({
        username: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .optional(),
        contact_number: Joi.number()
        .optional(),
        zipcode: Joi.number()
        .optional(),
        address: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .optional(),
        country: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .optional(),
        state: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .optional(),
        city: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        .optional(),
        gender: Joi.string().optional(),
        dob:Joi.date().optional()
    });


module.exports = {
    
    createAboutMe,
    updateAboutMe
};
