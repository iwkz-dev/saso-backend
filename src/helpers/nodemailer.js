const nodemailer = require('nodemailer');

// ! LATER: BEST PRACTICE FOR FLOW CHANGE PASSWORD
async function mailer(template) {
  let mailConfig;
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'development'
  ) {
    // all emails are delivered to destination
    mailConfig = {
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: false,
      auth: {
        // user: process.env.EMAIL_NODEMAILER,
        // pass: process.env.PASSWORD_EMAIL_NODEMAILER,
        user: process.env.EMAIL_NODEMAILER_GMAIL,
        pass: process.env.PASSWORD_EMAIL_NODEMAILER_GMAIL,
      },
    };
  } else {
    // all emails are catched by ethereal.email
    mailConfig = {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'daniella.hettinger@ethereal.email',
        pass: 'tquEkNk2EnQ9a72Tfw',
      },
    };
  }
  const transporter = nodemailer.createTransport(mailConfig);
  const mailOptions = template;

  try {
    const result = await transporter.sendMail(mailOptions);

    if (result) {
      return {
        result,
      };
    } else {
      throw { name: 'EmailError' };
    }
  } catch (error) {
    return {
      error,
    };
  }
}

module.exports = { mailer };
