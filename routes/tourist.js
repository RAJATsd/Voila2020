const express = require('express');
const commonController = require('../controllers/common');
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
router.post('/tourist/updateInterestAndLang',auth,touristController.postInsertInterestAndLanguage);

router.get('/tourist/deals/fav/:dealId',auth,touristController.getSetAsFavorites);
//for adding a deal to favorites
//requirements : _id of the deal as the param
router.get('/tourist/myProfile',auth,commonController.myProfile);
//send the profile of tourist
//requirements: nothing
router.get('/tourist/bookings/:status',auth,touristController.myBookings);
//sends the list of bookings depending on the status
//requirements: status of the booking in params
router.get('/tourist/favoriteDeals',auth,touristController.myFavorites);
//sends the list of favorite deals of the user
router.get('/tourist/deals/guide/:guideId',touristController.specificGuideDeals);
//sends the deals of a specific guide
//requirements : guide id of the specific guide

router.put('/tourist/profile/update/:USER',auth,commonController.editProfile);
//edits any changes in the profile
//requirements : fields in req.body, USER in params which will be either GUIDE or TOURIST
router.put('/tourist/profile/changePassword',auth,commonController.changePassword);
//changes the password
//requirements : New password in the field newPassword as the key name
// router.get('/getUserByEmail/:role/:email',auth,commonController.getUserByEmail);
router.put('/tourist/editBooking/:bookingId/:change',auth,touristController.editRequest);
// edits the specific booking according to the change
// requirements : bookingId and change in params
router.get('/getUserByEmail/:role/:email',commonController.getUserByEmail);
//gets user with provided email
//requirements : email and role in params
router.get('/tourist/messages/:id/',auth,touristController.showList);
//gets list of tourist chat with his/her tour guide
//requirements : touristId in params
module.exports = router;