// Handlebars Helpers
const alertMessage = require('../helpers/messenger');
// const Chat = require('../models/Chat');

// Other Requires
const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', async (req, res) => {
    console.log("here")
    console.log(req.user)
    res.render('chat/chat', { title: "Chat", user: req.user })

});

module.exports = router;
