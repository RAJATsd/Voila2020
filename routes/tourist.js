const express = require('express');
const touristController = require('../controllers/tourist');
const auth = require('../middleware/touristAuth');

const router = express.Router();

router.post('/tourist/guides',touristController.getGuidesBySearch);
//for searching of guides
//requirements : city,startDate,endDate
//returns the full model of the guides
router.post('/tourist/guides/offer/:guideId',auth,touristController.getSelectGuide);
//for making a offer
//requirements : _id of guide as param, everything in the bookings model except touristId,rating,review,reviewDate and status

router.post('/tourist/guides/deals/:dealId',auth,touristController.getDealAcceptance);
//for choosing a deal
//requirements : _id of deal as param, everything in the bookings model except guideId, touristId,price,rating,review,reviewDate and status

router.get('/tourist/deals/fav/:dealId',auth,touristController.getSetAsFavorites);
//for adding a deal to favorites
//requirements : _id of the deal as the param

module.exports = router;