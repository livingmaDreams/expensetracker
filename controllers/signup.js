const User = require('../models/users.js');

const path = require('path');
const bcrypt = require('bcrypt');

exports.getSignupPage =(req,res,next) =>{
    if(req.originalUrl == '/signup')
     res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
}

exports.addUser =  async (req,res,next) => {
    
    const name = req.body.name;
    const mail = req.body.mail;
    const password = req.body.password;
try{
    bcrypt.hash(password,10,async (err,hash) => {
    const [data,flag] = await User.findOrCreate({
        where:{mail: mail},
        defaults:{
        name: name,
        mail:mail,
        password: hash
        }
    });

    if(flag)
    res.status(201).json({newUseradded: 'success',data: data});
    else
    res.status(200).json({existingUser: 'found',data: data});

})
}
catch(err){
    res.status(500).json({status:'failure'});
}
}

exports.getLoginPage = (req,res,next) =>{
    if(req.originalUrl == '/login')
    res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
}

exports.loginUser = async (req,res,next) =>{
    const mail = req.body.mail;
    const password = req.body.password;
    try{
        const data = await User.findAll({where:{mail:mail}});
        bcrypt.compare(password,data[0].password,(err,result) =>{
            if(err)
              res.status(500).json({status:'somwthing went wrong'});
            if(result === false)
            res.status(200).json({status:'wrongpassword'});
            else
            res.status(200).json({status:'userfound',name:data[0].name});
        })        
      }
    catch(err){
        res.status(200).json({status:'usernotfound'})
    }
}