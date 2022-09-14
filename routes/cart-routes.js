const router = require('express').Router();
const { addToCart, getCart } = require('../controllers/cart-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/').post(authRoutes, addToCart);
router.route('/').get(authRoutes, getCart);

module.exports = router;
