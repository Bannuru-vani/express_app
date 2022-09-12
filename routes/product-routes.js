const router = require('express').Router();
const {
  addProduct,
  getProducts,
  getProduct,
} = require('../controllers/product-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/').post(authRoutes, addProduct);
router.route('/').get(authRoutes, getProducts);
router.route('/:slug').get(authRoutes, getProduct);

module.exports = router;
