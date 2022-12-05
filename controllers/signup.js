const User = require('../models/users.js');

const path = require('path');

exports.getSignupPage =(req,res,next) =>{
    if(req.originalUrl == '/signup')
     res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
}

exports.addUser = async (req,res,next) => {
    
    const name = req.body.name;
    const mail = req.body.mail;
    const password = req.body.password;
try{
    const [data,flag] = await User.findOrCreate({
        where:{mail: mail},
        defaults:{
        name: name,
        mail:mail,
        password: password
        }
    });

    if(flag)
    res.status(201).json({newUseradded: 'success',data: data});
    else
    res.status(200).json({existingUser: 'found',data: data});

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
          if(data[0].password === password)
          res.status(200).json({status:'userfound',name:data[0].name});
          else
          res.status(200).json({status:'wrongpassword'})     
      }
    catch(err){
        res.status(200).json({status:'usernotfound'})
    }
}