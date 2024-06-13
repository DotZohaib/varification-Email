const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/verification-email');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  image: String,
  files: [String],
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false }
});

userSchema.plugin(plm);

const User = mongoose.model('User', userSchema);

module.exports = User;
