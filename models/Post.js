const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Post = db.define('post',{
    post:{
        type:Sequelize.STRING(2000)
    },
    username:{
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
    vettingRequest: {
        type: Sequelize.STRING
    },
})

module.exports = Post;