const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Message = db.define('message',{
    post:{
        type:Sequelize.STRING(2000)
    },
    username:{
        type:Sequelize.STRING
    },
    category:{
        type:Sequelize.STRING
    },
    timestamp:{
        type: Sequelize.STRING
    },
    likes: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
})

module.exports = Message;