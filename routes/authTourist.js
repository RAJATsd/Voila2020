const express = require('express');
const touristController = require('../controllers/authTourist');

const router = express.Router();

router.post('/signup/tourist',touristController.postSignup);
router.post('/login/tourist',touristController.postLogin);

router.get('/logout',touristController.getLogout);


module.exports = router;