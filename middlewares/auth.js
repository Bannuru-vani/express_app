const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');
const User = require('../models/User');
exports.authRoutes = asyncHandler(async (req, res, next) => {
  let token;
  let authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    token = authorizationHeader.split(' ')[1];
  }
  if (!token) {
    return next(new httpError('Not Authorized', 403));
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_FOR_TOKEN);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(err);
  }
});
