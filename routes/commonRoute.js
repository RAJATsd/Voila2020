const express = require('express');
const controller = require('../controllers/commonController');

const router = express.Router();

router.get('/allDestinationInfo',controller.getAllDestInfo);
router.get('/allHotDeals',controller.getAllHotDeals);

module.exports = router;
