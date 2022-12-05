const express = require('express');
const router = express.Router();

const controller = require('../controllers/signup.js');

router.get('/',controller.getLoginPage);
router.post('/',controller.loginUser);


module.exports = router;