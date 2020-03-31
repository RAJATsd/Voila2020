const express = require('express');
const guideController = require('../controllers/authGuide');

const router = express.Router();

router.post('/signup/guide',guideController.postSignup);
router.post('/login/guide',guideController.postLogin);

router.get('/logout',guideController.getLogout);


module.exports = router;