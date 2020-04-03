const express = require('express');
const touristController = require('../controllers/tourist');
const auth = require('../middleware/touristAuth');

const router = express.Router();

router.post('/tourist/guides',touristController.getGuidesBySearch);
// body : city
// 
router.post('/tourist/guides/offer/:guideId',auth,touristController.getSelectGuide);
router.post('/tourist/guides/deals/:dealId',auth,touristController.getDealAcceptance);

router.get('/tourist/deals/fav/:dealId',auth,touristController.getSetAsFavorites);

module.exports = router;