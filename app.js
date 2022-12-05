const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));


const signupRouter = require('./routes/signup.js')
app.use('/signup',signupRouter);

const loginRouter = require('./routes/login.js');
app.use('/login',loginRouter);

const User = require('./models/users.js');

const sequelize = require('./util/database');
sequelize
.sync()
.then(() => app.listen(3000))
.catch(err => console.log(err));
