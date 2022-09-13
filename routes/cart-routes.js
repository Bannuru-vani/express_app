const router = require('express').Router();
const { addToCart } = require('../controllers/cart-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/').post(authRoutes, addToCart);

module.exports = router;
