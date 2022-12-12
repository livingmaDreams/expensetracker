const express = require('express');
const router = express.Router();

const controller = require('../controllers/signup.js');
const downloadController = require('../controllers/download');
const userAuthenticate = require('../middleware/authenticate');

router.get('/',controller.getPremiumPage);
router.get('/download',userAuthenticate.authenticate,downloadController.getDownloadLinks);
router.get('/createlink',userAuthenticate.authenticate,downloadController.createLink);

module.exports = router;