const express = require('express');
const guideController = require('../controllers/guide');
const auth = require('../middleware/guideAuth');

const router = express.Router();

router.post ('/guide/deals/add',auth,guideController.addDeal);
//adds deal for the guide
//requirements: all the fields in the deals schema except guideId and favorites
router.get('/guide/deals',auth,guideController.showDeal);
//lists all the of the particular guide
//requirements : nothing
router.get('/guide/offers',auth,guideController.showOffers);
//shows the request sent to the guide by tourist
//requirements : nothing
router.get('/guide/booking/response/:bookingId/:response',auth,guideController.bookingResponse);
//responds to the requests sent by the tourists
//requirements : _id of booking & response in the route as specified 

module.exports = router;