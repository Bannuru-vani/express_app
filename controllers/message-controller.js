const Message = require('../models/message');
const User = require('../models/User');
const Chat = require('../models/chat');
const { StatusCodes } = require('../utils/statusCodes');
const asyncHandler = require('../middlewares/asyncHandler');
const HttpError = require('../utils/httpError');

exports.sendMessage = asyncHandler(async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || !chatId) {
    return next(
      new HttpError('Please Provide All Fields To send Message', 403)
    );
  }

  let newMessage = {
    sender: req.user._id,
    message: message,
    chat: chatId,
  };

  let m = await Message.create(newMessage);

  m = await m.populate('sender', 'user');
  m = await m.populate('chat');
  m = await User.populate(m, {
    path: 'chat.users',
    select: 'user email _id',
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: m }, { new: true });

  return res.status(StatusCodes.OK).json(m);
});

exports.allMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const getMessage = await Message.find({ chat: chatId })
    .populate('sender', 'user email _id')
    .populate('chat');

  return res.status(StatusCodes.OK).json(getMessage);
});
