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
        .required()
       
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
    .required(),
    description: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    ingredients: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    tags: Joi.string()
    .required(),
    preparation_time: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    dish_photo: Joi.string()
    .required(),
    cost: Joi.number()
    .required(),
    
    

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
