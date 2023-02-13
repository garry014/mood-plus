const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Feedback = db.define('feedback',{
    title:{
        type: Sequelize.STRING
    },
    name:{
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
    },
    aifunction:{
        type: Sequelize.STRING
    },
    satisfaction:{
        type: Sequelize.STRING
    },
    description:{
        type: Sequelize.STRING(2000)
    },    
    timestamp:{
        type: Sequelize.STRING
    },
    classification:{
        type: Sequelize.STRING
    },

})

module.exports = Feedback;