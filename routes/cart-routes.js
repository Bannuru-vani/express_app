const router = require('express').Router();
const {
  addToCart,
  getCart,
  getCartCount,
  deleteAll,
  deleteFromCart,
} = require('../controllers/cart-controller');
const { authRoutes } = require('../middlewares/auth');

router
  .route('/')
  .post(authRoutes, addToCart)
  .get(authRoutes, getCart)
  .delete(authRoutes, deleteAll);

router.route('/deleteSignleItem').delete(authRoutes, deleteFromCart);
router.route('/count').get(authRoutes, getCartCount);

module.exports = router;
