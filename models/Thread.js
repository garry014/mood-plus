const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Chat = db.define('chat',{
    title:{
        type:Sequelize.STRING
    },
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
    isPinned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Chat;