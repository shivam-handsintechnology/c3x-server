const mongoose = require("mongoose");
const MyServicetypesList = require("./MyServicetypesList");

const ContactUsModelSchema = mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
            default: ""
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 255,
        },
        phone_number: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 15,
        },
        message: {
            type: String,
        },
        subject:{
            type: String,
        }
    },
    {
        timestamps: true,
    }
);


const ContactUsModel = mongoose.model("ContactUsModel", ContactUsModelSchema);

module.exports = ContactUsModel;
