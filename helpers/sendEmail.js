const nodemailer = require("nodemailer");
console.log("process.env.EMAIL_HOST", process.env.EMAIL_HOST);
console.log("process.env.EMAIL_PORT", process.env.EMAIL_PORT);
console.log("process.env.EMAIL_HOST_USER", process.env.EMAIL_HOST_USER);
console.log("process.env.EMAIL_HOST_PASSWORD", process.env.EMAIL_HOST_PASSWORD);
const service = "Outlook365";

module.exports.sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_HOST_USER, // Replace with your email address
      to: options.email, // Replace with recipient email address
      subject: options.subject || "Test Email",
    };
    if (options.text) {
      mailOptions.text = options.text
    }
    if (options.html) {
      mailOptions.html = options.html
    }

    console.log("mailOptions", mailOptions)
    const transporter = nodemailer.createTransport({
      service: service,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });


    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);

  } catch (err) {
    console.error("Error sending email:", err);

  }
};
module.exports.PromisesendEmail = async (options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        service: service,
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASSWORD,
        },
      });


      const info = await transporter.sendMail(options);
      console.log("Email sent successfully:", info.response);
      resolve(info)
    } catch (err) {
      console.error("Error sending email:", err);
      reject(err)
    }
  }
  )
};


// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   'https://developers.google.com/oauthplayground' // Redirect URI
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });

// const transporter = nodemailer.createTransport({
//   service: 'smtp.office365.com',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.EMAIL_HOST_USER,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//     accessToken: oauth2Client.getAccessToken(),
//   },
// });

// const mailOptions = {
//   from: options.fromemail,
//   to: options.email,
//   subject: options.subject || 'Test Email',
//   text: 'Hello, this is a test email!',
//   html: options.html || '<p>Hello, this is a test email!</p>',
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error('Error:', error);
//   } else {
//     console.log('Email sent successfully:', info.response);
//   }
// });
