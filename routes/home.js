const express = require('express');
const router = express.Router();

const controller = require('../controllers/signup.js');

router.get('/',controller.getHomePage);
router.get('/daily/:id',controller.getDailyExpenses)
router.post('/daily/:id',controller.postDailyExpenses);
router.delete('/daily/delete/:id',controller.delExpense);

module.exports = router;