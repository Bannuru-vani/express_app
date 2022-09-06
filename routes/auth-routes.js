const router = require('express').Router();
const {
  registerUser,
  loginUser,
  getUser,
  forgetPassword,
  resetPassword,
} = require('../controllers/user-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/signup').post(registerUser);

router.route('/login').post(loginUser);
router.route('/forgetpassword').post(forgetPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

router.route('/me').get(authRoutes, getUser);

module.exports = router;
