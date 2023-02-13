const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Emotionquote = db.define('emotionquote', { 
    happy: {
        type: Sequelize.STRING
    },
    sad:{
        type: Sequelize.STRING
    },
    neutral:{
        type: Sequelize.STRING
    },
    angry:{
        type: Sequelize.STRING
    },
    fear:{
        type: Sequelize.STRING
    }
});

module.exports = Emotionquote;