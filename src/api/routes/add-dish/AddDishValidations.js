const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const requireId = Joi.object().keys({
    id: Joi.objectId()
        .valid()
        .optional().allow('')
});

const createdish = Joi.object().keys({
    //newPassword: common.password,
    dish_title: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
           .required(),
        description: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        // .alphanum()
        .required(),
        ingredients: Joi.string()
        .required(),
        tags: Joi.string()
        .optional(),
        preparation_time: Joi.string()
        .required(),
        dish_photo: Joi.string()
        .optional(),
        cost: Joi.number()
        .required(),
        user_id: Joi.string()
        .required(),
        
       
});

// const addTopic = Joi.object().keys({
//     topicId: Joi.objectId()
//         .valid()
//         .required(),
//     subTopicId: Joi.objectId()
//         .valid()
//         .required(),
//     status: Joi.boolean()
//         .required(),
//     //.valid(['active', 'inactive']),
//     level: Joi.string()
//         .required()
//         .valid(['advanced', 'novice']),

// });


const updateProfile = Joi.object().keys({
    dish_title: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),
    description: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),
    ingredients: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),
    tags: Joi.string()
    .optional(),
    preparation_time: Joi.string()
    .optional(),
    dish_photo: Joi.string()
    .optional(),
    cost: Joi.number()
    .optional(),
    
    

});

// const updateDestination = Joi.object().keys({
//     latitude: Joi.number()
//         .required(),
//     longitude: Joi.number()
//         .required(),
//     deviceTime: Joi.number()
//         .optional(),
//     placemark: Joi.string()
//         .required(),
//     address: Joi.string()
//         .required(),
//     locationSharing: Joi.boolean()
//         .required()
// });

// const getNearByList = Joi.object().keys({
//     latitude: Joi.number()
//         .required(),
//     longitude: Joi.number()
//         .required(),
//     radius: Joi.number()
//         .required()
// });


const profileComplete = Joi.object().keys({
    notificationStatus: Joi.boolean().required()
});

module.exports = {

    createdish,



    // requireId,
    // updatePassword,
    // addTopic,
    updateProfile,
    // updateDestination,
    // getNearByList,
    // profileComplete
};
