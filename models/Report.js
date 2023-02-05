const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Report = db.define('report',{
    type:{
        type:Sequelize.STRING
    },
    postId:{
        type:Sequelize.INTEGER
    },
    post:{
        type:Sequelize.STRING(2000)
    },
    reportedBy:{
        type:Sequelize.STRING
    },
    classification:{
        type:Sequelize.STRING
    },
    timestamp:{
        type: Sequelize.STRING
    },
    isVetted:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Report;