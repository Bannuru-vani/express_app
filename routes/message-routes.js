const router = require('express').Router();
const {
  sendMessage,
  allMessages,
} = require('../controllers/message-controller');
const { authRoutes } = require('../middlewares/auth');

router.route('/:chatId').get(allMessages);
router.route('/').post(sendMessage);

module.exports = router;
