const asyncHandler = require('../middlewares/asyncHandler');
const Chat = require('../models/chat');
const User = require('../models/User');
const { StatusCodes } = require('../utils/statusCodes');

exports.getChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.send('No User Exists!');
  }

  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  chat = await User.populate(chat, {
    path: 'latestMessage.sender',
    select: 'username avatar email fullName _id',
  });

  if (chat.length > 0) {
    res.send(chat[0]);
  } else {
    const createChat = await Chat.create({
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
      'users',
      '-password'
    );

    res.status(StatusCodes.OK).json(fullChat);
  }
});

exports.createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please Fill all the feilds' });
  }

  var users = JSON.parse(req.body.users);

  // if (users.length < 2) {
  //   return res
  //     .status(400)
  //     .send("More than 2 users are required to form a group chat");
  // }

  users.push(req.user._id);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    //   isGroupChat: true,
    //   groupAdmin: req.user.id,
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  res.status(200).json(fullGroupChat);
};
