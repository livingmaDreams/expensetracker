const User = require('../models/users.js');

const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const Order = require('../models/order.js');

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
        password: hash,
        isPremium: 'false'
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
   
       // if(req.user.isPremium == 'true')
        //res.sendFile(path.join(__dirname,`../views/premium.html`));   
    res.sendFile(path.join(__dirname,`../views/home.html`));
   
}

exports.getDailyExpenses =(req,res,next) =>{
    let data = [];
const date = new Date().getDate();
const month = new Date().getMonth();
const yr = new Date().getFullYear();
req.user
.getExpenses()
.then(exp =>{
    for(let i of exp)
    {
        let sqlDate = i.createdAt.getDate();
        let sqlMonth = i.createdAt.getMonth();
        let sqlYr = i.createdAt.getFullYear();
        if(sqlDate == date && sqlMonth == month && sqlYr == yr)
            data.push(i);
       
    }
    return data;
})
.then(data => {
    res.status(200).json({expenses:data})
})
.catch(err => console.log(err));
}

exports.getMonthlyExpenses =(req,res,next) =>{
    let data = [];
const month = new Date().getMonth();
const yr = new Date().getFullYear();
req.user
.getExpenses()
.then(exp =>{
    for(let i of exp)
    {
        let sqlMonth = i.createdAt.getMonth();
        let sqlYr = i.createdAt.getFullYear();
        if(sqlMonth == month && sqlYr == yr)
            data.push(i);
       
    }
    return data;
})
.then(data => {
    res.status(200).json({expenses:data})
})
.catch(err => console.log(err));
}

exports.getYearlyExpenses =(req,res,next) =>{
    let data = [];
const yr = new Date().getFullYear();
req.user
.getExpenses()
.then(exp =>{
    for(let i of exp)
    {
        let sqlYr = i.createdAt.getFullYear();
        if(sqlYr == yr)
            data.push(i);
    }
    return data;
})
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


exports.buyPremium = (req,res,next) =>{
      let razorId;
      let razor;
    var instances = new Razorpay({
        key_id : 'rzp_test_Hflumc5ZeKLXrp',
        key_secret : 'b2f0ypGvOGUEukYuU6kR0G6j'
    })
    const amount = 2000;
    instances.orders.create({amount})
    .then(data => {
     razorId = data.id;
     return req.user.createOrder({orderid: razorId,status: 'PENDING'})
    })
    .then(() => res.status(200).json({orderid: razorId,key: instances.key_id,amount: amount}) )
    .catch(err => res.status(403).json({ message: 'Something went wrong', error: err}));
}

exports.updatePremium = (req,res,next) => {
    const orderid = req.body.orderid;
    const paymentid = req.body.paymentid;
    Order.findOne({where:{orderid:orderid}})
    .then(order => {
        return order.update({paymentid: paymentid,status:'SUCCESS'})
    })
    .then(() =>{
        return req.user.update({isPremium: 'true'})
    })
    .then(() => res.status(200).json({message: 'TRANSACTION SUCCESS'}))
    .catch(err => res.status(403).json({ error:err, message: 'TRANSACTION FAILED' }));
}

exports.getLeadershipRank = async (req,res,next) =>{
    
    let userExp = new Map();
    const users = await User.findAll();
     for(let user of users){
        let total=0;
        let userName = user.name;
        const expenses = await user.getExpenses();
         for(let expense of expenses){
              if(expense.category == 'credit')
                total = total + expense.amount;
             else
                total = total - expense.amount;
            }
        userExp.set(userName,total);
     }
     const mapSort = new Map([...userExp.entries()].sort((a, b) => b[1] - a[1]));
     let obj = Object.fromEntries(mapSort);
     let jsonString = JSON.stringify(obj);
     res.status(200).send({leadership: jsonString});
}



