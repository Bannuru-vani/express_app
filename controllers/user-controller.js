const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');

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

//#region ~ Util function to get token from model, and send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ token: token });
};
//#endregion
