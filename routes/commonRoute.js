const express = require('express');
const controller = require('../controllers/commonController');
const state = require('../controllers/state');
const router = express.Router();

router.get('/allDestinationInfo',controller.getAllDestInfo);
router.get('/allHotDeals',controller.getAllHotDeals);
router.get('/showCity/:name',state.findState);


module.exports = router;
