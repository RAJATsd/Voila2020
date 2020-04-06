const express = require('express');
const touristController = require('../controllers/authTourist');
const auth = require('../middleware/touristAuth');

const router = express.Router();

router.post('/signup/tourist',touristController.postSignup);
//signing up tourist
//requirements : everything in body which is in tourist model except statusCurrent and tokens
router.post('/login/tourist',touristController.postLogin);
//logging in tourist
//requirements : email and password
//returns full model of tourist with a token of key token
router.get('/tourist/logout',auth,touristController.getLogout);
//logging out tourist 
//requirement : nothing
router.get('/tourist/logoutAll',auth,touristController.getLogoutAll);
//logging out tourist from everywhere
//requirement : nothing

module.exports = router;