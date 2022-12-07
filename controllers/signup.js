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
              res.status(500).json({status:'something went wrong'});
            if(result === false)
            res.status(401).json({status:'wrongpassword'});
            else
            res.status(200).json({status:'userfound',id:data[0].id});
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
const id = req.params.id;
User.findAll({where:{id:id}})
.then(user =>{
    return user[0].getExpenses();
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
    const id = req.params.id;

   User.findAll({where:{id:id}})
   .then(user => {
    return user[0].createExpense({
        name:name,
        category:category,
        description:description,
        amount:amount
    })
    })
    .then(data => {
        res.status(200).json({newexpense:data})
    })
    .catch(err => console.log(err));  
}

exports.delExpense = (req,res,next) =>{
    const id = req.params.id;
    const Eid = req.query.Eid;

    User.findAll({where:{id:id}})
    .then(user =>{
        return user[0].getExpenses({where:{id:Eid}})
    })
    .then(exp => {
        return exp[0].destroy();
    })
    .then(() => res.status(200).json({deleted:'true'}))
    .catch(err => res.status(404).json({deleted:'false'}));
}