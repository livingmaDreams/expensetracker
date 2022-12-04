const express = require('express');
const router = express.Router();

const controller = require('../controllers/signup.js');

router.get('/',controller.getSignupPage);
router.post('/',controller.addUser);

module.exports = router;