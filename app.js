const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const https = require('https');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const dotenv = require('dotenv');
dotenv.config();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags: 'a'});

app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

app.use(morgan('combined',{stream: accessLogStream}));


const signupRouter = require('./routes/signup.js')
app.use('/signup',signupRouter);

const loginRouter = require('./routes/login.js');
app.use('/login',loginRouter);

const homeRouter = require('./routes/home.js');
app.use('/home',homeRouter);

const premiumRouter = require('./routes/premium');
app.use('/premium',premiumRouter);

const purchaseRouter = require('./routes/purchase.js');
app.use('/purchase',purchaseRouter);

const forgotpasswordRouter = require('./routes/forgotpassword.js');
app.use('/forgotpassword',forgotpasswordRouter);

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

const User = require('./models/users.js');
const Expense = require('./models/expenses.js');
const Order = require('./models/order')
const Forgotpassword = require('./models/forgotpassword');
const Download = require('./models/download')

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

const sequelize = require('./util/database');
sequelize
.sync()
.then(() => app.listen(3000))
.catch(err => console.log(err));
