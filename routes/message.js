const express = require('express');

const router = express.Router();

const MessageCtrl = require('../controllers/message');
const auth = require('../middleware/guideAuth');


router.post('guide/chat-messages/:senderId/:receiverId',auth,MessageCtrl.SendMessage)

module.exports = router;