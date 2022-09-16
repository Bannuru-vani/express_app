const router = require('express').Router();
const {
  addToCart,
  getCart,
  getCartCount,
} = require('../controllers/cart-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/').post(authRoutes, addToCart);
router.route('/').get(authRoutes, getCart);
router.route('/count').get(authRoutes, getCartCount);

module.exports = router;
