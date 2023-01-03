const router = require('express').Router();
const { getChat, createGroup } = require('../controllers/chat-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/').post(authRoutes, getChat);
router.route('/create').post(authRoutes, createGroup);

module.exports = router;
