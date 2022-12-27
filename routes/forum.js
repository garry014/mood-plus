const express = require('express');
const router = express.Router();

const alertMessage = require('../helpers/messenger');

// Main Forums page
router.get('/', (req, res) => {
    res.render('forum/main_page')
});

// Create Thread
router.get('/create_thread', (req, res) => {
    res.render('forum/create_thread')
});

// View Thread
router.get('/view_thread', (req, res) => {
    res.render('forum/view_thread')
});

module.exports = router;