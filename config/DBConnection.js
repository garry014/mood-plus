const mySQLDB = require('./DBConfig');
const thread = require('../models/Thread');
const posts = require('../models/Post');
const chat = require('../models/Chat');
const messages = require('../models/Message');
const User = require('../models/User');
const feedback = require('../models/Feedback');
const emotiondetection = require('../models/Emotiondetection');
const emotionquote = require('../models/Emotionquote')


// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Mood+ database connected');
        })
        .then(() => {
        /*
        Defines the relationship where a user has many videos.
        In this case the primary key from user will be a foreign key
        in video.
        */
            chat.hasMany(messages);
            thread.hasMany(posts);
            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('----------------------------------------------------------\n');
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};
module.exports = { setUpDB };
