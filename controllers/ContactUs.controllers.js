const { sendEmail } = require("../helpers/sendEmail")
const ContactUsModel = require("../models/ContactUsModel")
const { validateContactUs } = require("../utils/Validator")
const { sendResponse, errorHandler } = require("../utils/dataHandler")

module.exports = {
    Contactus: async (req, res) => {
        try {

            const { error } = validateContactUs(req.body)
            if (error) return sendResponse(res, 400, error.details[0].message, error.details[0].message)
            const existEmail = ContactUsModel.findOne({ email: req.body.email })
            let data
            if (existEmail) {
                data = await ContactUsModel.findOneAndUpdate({ email: req.body.email }, { $set: req.body })
            } else {
                data = await ContactUsModel.create(req.body)
            }
            sendEmail({
                email: req.body.email,
                subject: "Contact Us",
                contact: true,
                html: `<p>Dear ${req.body.full_name},</p>
    <p>Thank you for reaching out! You are an invaluable part of everything we do here. And we’re absolutely thrilled to hear from you.</p>
    <p>Be it your suggestions, ideas, or even queries, our inbox is always waiting for your messages, so talk to us like you have today any time and often.</p>
    <p>Our concerned department will get back to you soon</p>
    <p>Cheers!</p>
    <p>Team C3X</p>`
                // 

                // 
            })
            sendEmail({
                email: process.env.CONTACT_EMAIL_HOST_USER,
                subject: "Contact Us",
                // contact: true,
                html: `<p>Dear Admin, You have a new contact us request from ${req.body.full_name}.</p>
                <p>Name: ${req.body.full_name}</p>
                <p>Subject: ${req.body.subject}</p>
                <p>Message: ${req.body.message}</p>
                <p>Email: ${req.body.email}</p>
                <p>Phone Number: ${req.body.phone_number}</p>
                `
            })

            return sendResponse(res, 200, " Thank you for contacting us. We will get back to you soon.", " Thank you for contacting us. We will get back to you soon.")
        } catch (error) {
            return errorHandler(res, 500, error)
        }
    }
}