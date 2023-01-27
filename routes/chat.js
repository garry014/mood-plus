// Handlebars Helpers
const alertMessage = require('../helpers/messenger');

// Other Requires
const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res) => {
    res.render('chat/chat', { title: "Create new thread" })
});

module.exports = router;