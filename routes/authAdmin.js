const express = require('express');
const adminController = require('../controllers/authAdmin');
const auth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/signup/admin',adminController.postSignup);

router.post('/login/admin',adminController.postLogin);

router.get('/admin/logout',auth,adminController.getLogout);

router.get('/admin/logoutAll',auth,adminController.getLogoutAll);

module.exports = router;