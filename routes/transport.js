const path = require('path');
const transAuth = require('../controllers/transauth');
const express = require('express');
const transController = require('../controllers/transport');
const router = express.Router();
router.get('/trans', transController.getPage);
router.post('/translogin', transAuth.postTransLogin);
router.post('/bidding', transController.postBid);
router.post('/quitbid', transController.quitBid);
router.get('/translist', transController.getList);

router.get('/translogout', transController.getLogOut);
router.post('/clearbiditem', transController.getClearBidItem);
router.get('/bids/:productId/:PID', transController.getProduct);
module.exports = router;