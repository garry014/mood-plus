const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Thread = db.define('thread',{
    title:{
        type:Sequelize.STRING
    },
    post:{
        type:Sequelize.STRING(2000)
    },
    summary:{
        type:Sequelize.STRING(100)
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
    editTime:{
        type: Sequelize.STRING
    },
    editedBy:{
        type: Sequelize.STRING
    },
    hiddenReason: {
        type: Sequelize.STRING
    },
    isClosed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    isPinned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    vettingRequest: {
        type: Sequelize.STRING
    },
});

module.exports = Thread;