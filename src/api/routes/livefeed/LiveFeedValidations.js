const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');


const create = Joi.object().keys({
    image: Joi.string()
    .required(),
    user_id: Joi.string()
    .required(),
    image_user_id: Joi.string()
    .required(),
    });
   
    

     const updatePhoto = Joi.object().keys({
        image: Joi.string()
    .optional(),
     });



module.exports = {
    
       create,
       updatePhoto,
    
};
