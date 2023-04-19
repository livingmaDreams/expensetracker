const User = require('../models/users.js');
const Expense = require('../models/expenses.js');

const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const Order = require('../models/order.js');
const sequelize = require('../util/database');


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
    return jwt.sign({userid: id},process.env.JWT_TOKEN);
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
            res.status(200).json({status:'userfound',token: generateToken(data[0].id),premium: data[0].isPremium});
        })        
      }
    catch(err){
        res.status(404).json({status:'usernotfound'})
    }
}



exports.getHomePage = (req,res,next) =>{  
    res.sendFile(path.join(__dirname,`../views/home.html`)); 
}

exports.getPremiumPage = (req,res,next) =>{  
    res.sendFile(path.join(__dirname,`../views/premium.html`)); 
}

exports.getDailyExpenses = async(req,res,next) =>{
    const page = req.params.page;
    const limit = +req.query.perPage;
    let tDate = new Date().getDate();
try{
    const date = sequelize.fn('date_format', sequelize.col('createdAt'), '%d');
    const where = sequelize.where(date,tDate)
    const totalExp = await req.user.getExpenses({where: where});
    const exp = await req.user.getExpenses({where: where, offset:((page-1)*limit),limit: +limit});
    const pages = Math.ceil(totalExp.length/limit);
    if(page == '1')
    res.status(200).json({expenses:exp,totalpages: pages});
    else
    res.status(200).json({expenses:exp,totalpages: 0});
}
catch(err){
    console.log(err);
}
}


exports.getMonthlyExpenses = async (req,res,next) =>{
    const page = req.params.page;
    let tMonth = new Date().getMonth();
    tMonth = tMonth + 1;
    const limit = +req.query.perPage;
try{
    const month = sequelize.fn('date_format', sequelize.col('createdAt'), '%m');
    const where = sequelize.where(month,tMonth)
    const totalExp = await req.user.getExpenses({where: where});
    const exp = await req.user.getExpenses({where: where, offset:((page-1)*limit),limit: limit});
    const pages = Math.ceil(totalExp.length/limit);
    if(page == '1')
    res.status(200).json({expenses:exp,totalpages: pages});
    else
    res.status(200).json({expenses:exp,totalpages: 0});
}
catch(err){
    console.log(err);
}
}

exports.getYearlyExpenses = async (req,res,next) =>{
    const page = req.params.page;
const yr = new Date().getFullYear();
const limit = +req.query.perPage;
try{
    const year = sequelize.fn('date_format', sequelize.col('createdAt'), '%Y');
    const where = sequelize.where(year,yr)
    const totalExp = await req.user.getExpenses({where: where});
    const exp = await req.user.getExpenses({where: where, offset:((page-1)*limit),limit: limit});
    const pages = Math.ceil(totalExp.length/limit);
    if(page == '1')
    res.status(200).json({expenses:exp,totalpages: pages});
    else
    res.status(200).json({expenses:exp,totalpages: 0});
}
catch(err){
    console.log(err);
}
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

exports.editExpenses = async (req,res,next) =>{
    const name = req.body.name;
    const amount = req.body.amount;
    const desc = req.body.description;
    const category = req.body.category;
    const id = req.body.id;
    try{
    const exp =  await Expense.findOne({where:{id:id,userId:req.user.id}})
    await exp.update({name:name,amount:amount,description:desc,category:category});
      res.status(200).json({edited:'true'})
    }catch(err){
        res.status(404).json({edited:'false'})
    };
 }

exports.delExpense = (req,res,next) =>{
    const name = req.body.name;
    const amount = req.body.amount;
    const desc = req.body.desc;
    const category = req.body.category;

     req.user
     .getExpenses({where:{name:name,amount:amount,description:desc,category:category}})
     .then(exp => {
        console.log(exp)
         return exp[0].destroy();
        })
      .then(() => res.status(200).json({deleted:'true'}))
       .catch(err => res.status(404).json({deleted:'false'}));
 }


exports.buyPremium = async (req,res,next) =>{

  
    if(req.user.isPremium == 'true')
    res.status(200).json({message:"Premium user"})
    else{
      let razorId;
    var instances = new Razorpay({
        key_id : process.env.RAZORPAY_ID,
        key_secret : process.env.RAZORPAY_SECRET
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
    
    let userExp =[];
  
    const users = await User.findAll();
     for(let user of users){
        let obj={};
        let total=0;
        let userName = user.name;
        const expenses = await user.getExpenses();
         for(let expense of expenses){
              if(expense.category == 'credit')
                total = total + expense.amount;
             else
                total = total - expense.amount;
            }
            obj = {username: userName,total:total};
        userExp.push(obj);
     }
 const sort = userExp.sort((a, b) => b.total - a.total)
     res.status(200).send({leadership: sort});
}


