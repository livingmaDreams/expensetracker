const express = require('express');
const router = express.Router();

const forgotpassword = require('../controllers/forgotpassword.js');

router.get('/',forgotpassword.getPage);
router.post('/called',forgotpassword.getPasswordLink);

module.exports = router;