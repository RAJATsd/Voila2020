const express = require('express');
const adminControllers = require('../controllers/admin');
const auth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/admin/Guides/:status',auth,adminControllers.getAllPendingRequests);
router.get('/admin/decision/:guideId/:finalStatus',auth,adminControllers.decideGuide);
router.get('/admin/allReports',auth,adminControllers.getAllReports);
router.get('/admin/getUserForReport/:reportId',auth,adminControllers.specificUserOfReport);
router.get('/admin/decision/report/:reportId/:status',auth,adminControllers.decideReport);

module.exports = router;