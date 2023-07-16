const express = require('express');
const { createChat, getChat } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', createChat);

router.get('/', getChat);

module.exports = router;
