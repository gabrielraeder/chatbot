const Chat = require('../models/Chat');

const createChat = async (req, res) => {
  const chats = await Chat.find().exec();
  const number = chats.length > 0 ? chats[chats.length - 1].number + 1 : 1;
  const obj = {
    ...req.body,
    date: new Date().toISOString(),
    number,
  };
  await Chat.create(obj);
  return res.status(201).end();
};

const getChat = async (req, res) => {
  const chats = await Chat.find().exec();
  return res.status(200).json(chats);
};

module.exports = { createChat, getChat };
