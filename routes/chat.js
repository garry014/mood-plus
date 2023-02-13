// Handlebars Helpers
const alertMessage = require('../helpers/messenger');
// const Chat = require('../models/Chat');

// Other Requires
const express = require('express');
const router = express.Router();
const request = require('request');
const axios = require("axios");

router.get('/', async (req, res) => {
    console.log("here")
    console.log(req.user)
    res.render('chat/chat', { title: "Chat", user: req.user })

});

router.post('/autocomplete', async (req, res) => {
    console.log(req.body.searchText)

    const options = {
        method: 'POST',
        url: 'https://api.emojidata.ai/predict',
        params: {api_key: '1atc3-xQbyPcNa3-JaYw', depth: req.body.depth, searchText: req.body.searchText, ts: req.body.ts, fanOut: '2', 'end_user_id': 'woofy_dev_user', 'personal_dict': ["cat","dearly"]},
    };

    axios.request(options).then(function (response) {
        //console.log(response.data);
        console.log("emojidataAPI data retrieved.")
        res.json(response.data);
    }).catch(function (error) {
        console.error(error);
    });
});

module.exports = router;
