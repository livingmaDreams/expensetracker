const User = require('../models/users.js');
const Order = require('../models/order.js');

const path = require('path');

exports.getPage = (req,res,next) =>{
    res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
};

exports.getPasswordLink =(req,res,next) =>{
    console.log('hi');
}

