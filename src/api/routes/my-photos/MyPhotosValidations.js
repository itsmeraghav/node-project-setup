const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');


const create = Joi.object().keys({
    image: Joi.string()
    .optional(),
    });

     const updatePhoto = Joi.object().keys({
        image: Joi.string()
    .optional(),
     });



module.exports = {
    
       create,
       updatePhoto,
    
};
