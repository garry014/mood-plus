const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Emotiondetection = db.define('emotiondetection', { 
    random_id: {
		type: Sequelize.STRING
	},
    photo: {
		type: Sequelize.STRING
	},
    emotion_result:{
        type: Sequelize.STRING
    },
    quote_generated:{
        type: Sequelize.STRING
    }
});

module.exports = Emotiondetection;