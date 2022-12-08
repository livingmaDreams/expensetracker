const User = require('../models/users.js');

const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

function generateToken(id){
    return jwt.sign({userid: id},'12345678987654321');
}

exports.loginUser = async (req,res,next) =>{
    const mail = req.body.mail;
    const password = req.body.password;
    try{
        const data = await User.findAll({where:{mail:mail}});
        bcrypt.compare(password,data[0].password,(err,result) =>{
            if(err)
              res.status(500).json({status:'something went wrong'});
            if(result === false)
            res.status(401).json({status:'wrongpassword'});
            else
            res.status(200).json({status:'userfound',token: generateToken(data[0].id)});
        })        
      }
    catch(err){
        res.status(404).json({status:'usernotfound'})
    }
}

exports.getHomePage = (req,res,next) =>{
    res.sendFile(path.join(__dirname,`../views/home.html`));
}

exports.getDailyExpenses =(req,res,next) =>{

req.user
.getExpenses()
.then(data => {
    res.status(200).json({expenses:data})
})
.catch(err => console.log(err));
}

exports.postDailyExpenses = (req,res,next) =>{
    const name = req.body.name;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
 
req.user
.createExpense({
        name:name,
        category:category,
        description:description,
        amount:amount
    })
.then(data => {
        res.status(200).json({newexpense:data})
    })
.catch(err => console.log(err));  
}

exports.delExpense = (req,res,next) =>{
req.user
.getExpenses()
.then(exp => {
  return exp[0].destroy();
})
.then(() => res.status(200).json({deleted:'true'}))
.catch(err => res.status(404).json({deleted:'false'}));
}