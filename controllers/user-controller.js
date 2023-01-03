const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendMail');

//#region ~ POST - /api/v1/auth/signup - REGISTER USER - PUBLIC -
exports.registerUser = asyncHandler(async (req, res, next) => {
  let { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  sendTokenResponse(user, 200, res);
});
//#endregion

//#region ~ POST - /api/v1/auth/login - LOGIN USER - PUBLIC
exports.loginUser = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return next(new httpError('Please check your email and pasword', 403));
  }
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new httpError('Invalid creds', 403));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new httpError('Invalid creds', 403));
  }

  sendTokenResponse(user, 200, res);
});
//#endregion

//#region ~ GET - /api/v1/auth/me - GET USER(info of logged in user) - PRIVATE
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ user: user.toObject({ getters: true }) });
});
//#endregion

// ? ************************ FORGOT PASSWORD *************************
// @desc    Forget password
// @route   POST /api/v1/auth/forgetpassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new httpError('This email is not Registered', 401));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has 
    requested the reset of a password. Please go to the link provided below to Reset Your Password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      name: user.name,
      email: user.email,
      subject: 'Password reset token',
      resetUrl,
    });

    return res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new httpError('Email could not be sent', 500));
  }
});

// @desc    Reset Password
// @route   GET /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hased token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new httpError('Invalid token', 400));
  }

  // Set new Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(201).json({ success: true, data: 'Password Changed' });
});

exports.searchUser = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  console.log(search);
  const user = await User.find({
    user: { $regex: search, $options: 'i' },
  }).select('user _id email');

  return res.status(200).json({ success: true, data: user });
});

//#region ~ Util function to get token from model, and send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ token: token });
};
//#endregion
