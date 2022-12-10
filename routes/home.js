const express = require('express');
const router = express.Router();

const controller = require('../controllers/signup.js');
const userAuthenticate = require('../middleware/authenticate');

router.get('/',controller.getHomePage);
router.get('/daily',userAuthenticate.authenticate,controller.getDailyExpenses);
router.post('/daily',userAuthenticate.authenticate,controller.postDailyExpenses);
router.delete('/daily/delete',userAuthenticate.authenticate,controller.delExpense);
router.get('/leadership',controller.getLeadershipRank);


module.exports = router;