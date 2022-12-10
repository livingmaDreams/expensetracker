const express = require('express');
const router = express.Router();

const controller = require('../controllers/signup.js');
const userAuthenticate = require('../middleware/authenticate');

router.get('/premiumUser',userAuthenticate.authenticate,controller.buyPremium);
router.post('/premiumUser',userAuthenticate.authenticate,controller.updatePremium);


module.exports = router;