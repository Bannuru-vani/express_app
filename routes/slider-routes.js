const router = require('express').Router();
const {
  addSlider,
  getSliders,
  changeActiveStatus,
} = require('../controllers/slider-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/').post(authRoutes, addSlider);
router.route('/').get(authRoutes, getSliders);
router.route('/:sliderId').put(authRoutes, changeActiveStatus);

module.exports = router;
