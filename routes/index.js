var express = require('express');
var router = express.Router();
let userModel = require("./users");
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
let upload = require("./multer");
let postModel = require("../models/post");
let tempUserModel = require("../models/TempUser")
let path = require("path"); // Import path

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});


router.post("/upload", isLoggedIn, upload.single("image"), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.image = req.file.filename;
  await user.save();
  res.redirect("/profile");
});



router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get('/profile', isLoggedIn, async function(req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (user) {
      res.render('profile', { title: 'Express', user: user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    next(error);
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.isVerified) {
    return next();
  }
  res.redirect("/verify");
}

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post("/register", function(req, res, next) {
  let otp = crypto.randomBytes(4).toString('hex');
  let userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    otp: otp,
    otpExpires: Date.now() + 3600000 // 1 hour
  });

  userModel.register(userdata, req.body.password)
  .then(function(registereduser) {
    // Send OTP email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Acme <onboarding@resend.dev>',
        pass: 're_123456789'
      }
    });

    let mailOptions = {
      from: 'Acme <onboarding@resend.dev>',
      to: registereduser.email,
      subject: 'Email Verification',
      text: `Your OTP for email verification is ${otp}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    res.redirect('/verify');
  });
});

router.get('/verify', function(req, res, next) {
  res.render('verify');
});

router.post('/verify', function(req, res, next) {
  console.log("Received email: ", req.body.email);
  console.log("Received OTP: ", req.body.otp);

  userModel.findOne({ email: req.body.email, otp: req.body.otp, otpExpires: { $gt: Date.now() } })
  .then(function(user) {
    if (!user) {
      console.log("No user found or OTP expired");
      return res.redirect('/register');
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.save().then(function() {
      console.log("User verified and saved");
      req.login(user, function(err) { // Log the user in after verification
        if (err) {
          console.error("Error logging in user:", err);
          return next(err);
        }
        res.redirect('/profile');
      });
    });
  })
  .catch(function(err) {
    console.error("Error during verification:", err);
    return next(err);
  });
});

// Forgot password routes
router.get('/forgot', function(req, res, next) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  let otp = crypto.randomBytes(4).toString('hex');
  userModel.findOneAndUpdate(
    { email: req.body.email },
    { otp: otp, otpExpires: Date.now() + 3600000 }, // 1 hour
    { new: true }
  ).then(function(user) {
    if (!user) {
      console.log("No user found with that email");
      return res.redirect('/forgot');
    }
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Acme <onboarding@resend.dev>',
        pass: 're_123456789'
      }
    });

    let mailOptions = {
      from: 'Acme <onboarding@resend.dev>',
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    res.redirect('/reset');
  }).catch(function(err) {
    console.error("Error during forgot password:", err);
    return next(err);
  });
});

router.get('/reset', function(req, res, next) {
  res.render('reset');
});

router.post('/reset', function(req, res, next) {
  userModel.findOne({ email: req.body.email, otp: req.body.otp, otpExpires: { $gt: Date.now() } })
  .then(function(user) {
    if (!user) {
      console.log("No user found or OTP expired");
      return res.redirect('/forgot');
    }
    user.setPassword(req.body.password, function(err) {
      if (err) {
        console.error("Error setting new password:", err);
        return next(err);
      }
      user.otp = undefined;
      user.otpExpires = undefined;
      user.save().then(function() {
        req.login(user, function(err) {
          if (err) {
            console.error("Error logging in user after password reset:", err);
            return next(err);
          }
          res.redirect('/profile');
        });
      });
    });
  })
  .catch(function(err) {
    console.error("Error during password reset:", err);
    return next(err);
  });
});

module.exports = router;
