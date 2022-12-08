const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = (req,res,next) => {
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token,'12345678987654321');
        User.findByPk(user.userid)
        .then(user => {
            req.user = user;
            next();
        })
    }
    catch(err){
        return res.status(401).json({status:false});
    }
}