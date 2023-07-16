const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
    default: [],
  },
  number: {
    type: Number,
    required: true,
  },
});

mongoose.model('Chat', chatSchema);
const Chat = mongoose.model('Chat');

module.exports = Chat;
