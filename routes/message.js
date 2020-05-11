const express = require('express');

const router = express.Router();

const MessageCtrl = require('../controllers/message');
const auth = require('../middleware/guideAuth');
const auth1 = require('../middleware/touristAuth');


router.get('/guide/chat-messages/:sender_Id/:receiver_Id',auth,MessageCtrl.GetAllMessages)

router.post('/guide/chat-messages/:sender_Id/:receiver_Id',auth,MessageCtrl.SendMessage)

router.post('/tourist/chat-messages/:sender_Id/:receiver_Id',auth1,MessageCtrl.SendMessage)



module.exports = router;