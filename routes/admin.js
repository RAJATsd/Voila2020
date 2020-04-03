const express = require('express');
const adminControllers = require('../controllers/admin');

const router = express.Router();

router.get('/admin/Guides',adminControllers.getAllPendingRequests);
router.get('/admin/decision/:guideId/:finalStatus',adminControllers.decideGuide);

module.exports = router;