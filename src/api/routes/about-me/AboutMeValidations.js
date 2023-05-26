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
        address: Joi.string()
        .required(),
        country: Joi.string()
        .required(),
        state: Joi.string()
        .required(),
        city: Joi.string()
        .required(),
        dob:Joi.date().optional(),
        gender: Joi.string().required(),
        license_expiry_date:Joi.date().required(),
        about_me:Joi.string().required(),
        ethnicity:Joi.string().required(),
        language:Joi.string().required(),
        select_cuisines_detail:Joi.string().required(),
        other_service_offered:Joi.string().required()
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
