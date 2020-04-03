const express = require('express');
const guideController = require('../controllers/authGuide');

const router = express.Router();

router.post('/signup/guide',guideController.postSignup);
//signing up guide
//requirements : everything in body which is in tourGuide model except picUrl,tokens,occupied and profileStatus
//profile pic should be uploaded with name of the field profilePic
router.post('/login/guide',guideController.postLogin);
//logging in guide
//requirements : email and password
//returns full model of guide with a token of key token
router.get('/logout',guideController.getLogout);
//logging out
//requirements : nothing

module.exports = router;