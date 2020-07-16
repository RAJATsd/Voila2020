const express = require('express');

const router = express.Router();

const MessageCtrl = require('../controllers/message');
const auth = require('../middleware/guideAuth');
const auth1 = require('../middleware/touristAuth');




//router.get('/receiver-messages/:sender/:receiver',auth,MessageCtrl.MarkReceiverMessages)
router.get('/guide/chat-messages/:sender_Id/:receiver_Id',auth,MessageCtrl.GetAllMessages);
//gets list of guide chat with a specific tourist
//requirements : sendar and receiver id in params

router.get('/tourist/chat-messages/:sender_Id/:receiver_Id',auth1,MessageCtrl.GetAllMessages);
//gets list of tourist chat with a specific guide
//requirements : sendar and receiver id in params

router.post('/guide/chat-messages/:sender_Id/:receiver_Id',auth,MessageCtrl.SendMessage)

router.post('/tourist/chat-messages/:sender_Id/:receiver_Id',auth1,MessageCtrl.SendMessage)



module.exports = router;