const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expenses = sequelize.define('expenses',{
        id:{
            type:Sequelize.INTEGER,
            autoIncrement: true,
            allowNull:false,
            primaryKey:true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount:{
            type:Sequelize.FLOAT,
            allowNull:false
        },
        description:{
            type: Sequelize.STRING,
        },
        category:{
            type: Sequelize.STRING
        }
    
});

module.exports = Expenses;