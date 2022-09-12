const router = require('express').Router();
const {
  addProduct,
  getProducts,
} = require('../controllers/product-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/').post(authRoutes, addProduct);
router.route('/').get(authRoutes, getProducts);

module.exports = router;
