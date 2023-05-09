const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');



const createservice = Joi.object().keys({
    
    // service_name: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    // .required(),
    question: Joi.string()
    .optional(),
    answer: Joi.string()
    .optional(),
     
       
});




const updateProfile = Joi.object().keys({
//     service_name: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
//     .optional(),
});


module.exports = {

    createservice, 
    updateProfile,
    
};
