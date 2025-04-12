const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'jude.koch@ethereal.email',
      pass: 'AGPaDFtrPxAc9bzgrN'
  }
});

// Define email sending job
module.exports.defineJobs = (agenda) => {
  agenda.define('send email', async (job) => {
    const { to, subject, body } = job.attrs.data;

    const mailOptions = {
      from: process.env.EMAIL_FROM,  // The sender address shown to recipients
      to,
      subject,
      html: body
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  });
};

// Schedule an email to be sent after a delay (in minutes)
module.exports.scheduleEmail = async (agenda, to, subject, body, delayMinutes = 60) => {
  // Schedule the email
  await agenda.schedule(
    `in ${delayMinutes} minutes`,
    'send email',
    { to, subject, body }
  );

  console.log(`Email to ${to} scheduled to be sent in ${delayMinutes} minutes`);
};
