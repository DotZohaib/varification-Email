const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: '5m' }  // OTP expires in 5 minutes
});

const TempUser = mongoose.model('TempUser', tempUserSchema);

module.exports = TempUser;
