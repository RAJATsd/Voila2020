const express = require('express');
const commonController = require('../controllers/common');
const guideController = require('../controllers/guide');
const auth = require('../middleware/guideAuth');
const uploadConfig = require('../middleware/fileUpload');

const router = express.Router();

router.post('/guide/deals/add',auth,guideController.addDeal);
//adds deal for the guide
//requirements: all the fields in the deals schema except guideId and favorites
router.post('/guide/fillAnswers',auth,guideController.fillAnswers)

router.get('/guide/deals',auth,guideController.showDeal);
//lists all the deals of the particular guide
//requirements : nothing
router.get('/guide/offers/:status',auth,guideController.showOffers);
//shows the request sent to the guide by tourist
//requirements : nothing
router.get('/guide/booking/response/:bookingId/:response',auth,guideController.bookingResponse);
//responds to the requests sent by the tourists
//requirements : _id of booking & response in the route as specified
router.get('/guide/myProfile',auth,commonController.myProfile);
//sends the profile of the guide 
//requirements : nothing
router.get('/guide/deleteDeal/:dealId',auth,commonController.deleteDeal);

router.put('/guide/profile/update/:USER',auth,uploadConfig,guideController.editProfile);
//edits any changes in the profile
//requirements : fields in req.body, USER in params which will be either GUIDE or TOURIST
router.put('/guide/profile/changePassword',auth,commonController.changePassword);
//changes the password
//requirements : New password in the field newPassword as the key name
router.get('/getUserByEmail/:role/:email',commonController.getUserByEmail);
//gets user with provided email
//requirements : email and role in params
router.get('/guide/messages/:id/',auth,guideController.showList);
//gets list of tour guide chat with his/her tourists
//requirements : guideId in params

module.exports = router;