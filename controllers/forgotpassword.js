const User = require('../models/users.js');
const Forgotpassword = require('../models/forgotpassword');
const sgMail = require('@sendgrid/mail');
const uuid = require('uuid');

const path = require('path');

exports.getPage = (req,res,next) =>{
    res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
};

exports.getPasswordLink = async(req,res,next) =>{
  const mail = req.body.mail;
  
try{
  const id = uuid.v4();
  let current = new Date();
  current.setHours(current.getHours() + 1);
  const user = await User.findOne({where:{mail:mail}});
  if(user)
  await user.createForgotpassword({id:id,active:'true',expiresby:current});

  
 const msg = {
  to: 'sdeepicivil@gmail.com', 
  from: 'deepi.sakthivel@outlook.com',
  subject: 'Reset Password Link',
  text: 'Click on this link to reset a password',
  html: `<a href='http://localhost:3000/forgotpassword/${id}'>Reset Password Link</a>`
}
await sgMail.send(msg);

res.status(200).json({Status:'true'});
}
catch(err){
    res.status(500).json({Status:'false'});
}
}

exports.getChangePwdPage = (req,res,next) =>{
    res.sendFile(path.join(__dirname,`../views/changepassword.html`)); 
}

