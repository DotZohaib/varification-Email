// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');
// const User = require('./users');

// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// router.post('/send-otp', async (req, res) => {
//   const { email } = req.body;
//   const otp = generateOTP();
//   const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes from now

//   let transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   let mailOptions = {
//     from: 'no-reply@example.com',
//     to: email,
//     subject: 'Your One-Time Password (OTP)',
//     html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     await User.updateOne({ email }, { otp, otpExpires });
//     res.status(200).send({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: 'Failed to send OTP' });
//   }
// });

// module.exports = router;
