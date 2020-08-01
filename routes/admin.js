const express = require('express');
const adminControllers = require('../controllers/admin');
const auth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/admin/Guides/:status',auth,adminControllers.getAllPendingRequests);
router.get('/admin/decision/:guideId/:finalStatus',auth,adminControllers.decideGuide);

module.exports = router;