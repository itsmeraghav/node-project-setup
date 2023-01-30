
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var ChangePasswordSchema = new Schema({
    oldpassword: {
        type: String,
        required: true
    },

    newpassword: {
        type: String,
        required: true
    },

    confirmpassword: {
        type: String,
        required: true
    },

    status: {
        type: Number,
        default: 1
    },
    is_edit: {
        type: Number,
        default: 1
    },
    is_deleted: {
        type: Number,
        default: 0,
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, collection: 'ChangePassword' });

ChangePasswordSchema.plugin(uniqueValidator, { message: 'is already taken.' });


module.exports = mongoose.model("ChangePassword", ChangePasswordSchema);