const express = require('express');
const guideController = require('../controllers/guide');

const router = express.Router();

router.post ('/guide/deals/add',guideController.addDeal);

router.get('/guide/deals',guideController.showDeal);
router.get('/guide/offers',guideController.showOffers);
router.get('/guide/booking/response/:bookingId/:response',guideController.bookingResponse);

module.exports = router;