const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Chat = db.define('chat',{
    sender:{
        type:Sequelize.STRING
    },
    recipient:{
        type:Sequelize.STRING
    },
    sendername:{
        type:Sequelize.STRING
    },
    recipientname: {
        type:Sequelize.STRING
    }
});

module.exports = Chat;