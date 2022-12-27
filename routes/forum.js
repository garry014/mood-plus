// DB Table Connections
const Thread = require('../models/Thread');
// const Post = require('../models/Post');

// Handlebars Helpers
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');

// Other Requires
const express = require('express');
const router = express.Router();

// Main Forums page
router.get('/', (req, res) => {
    res.render('forum/main_page')
});

// GET: Create Thread
router.get('/create_thread', (req, res) => {
    res.render('forum/create_thread', { title: "Create new thread" })
});

// POST: Create Thread
router.post('/create_thread', (req, res) => {
    let { title, post, category } = req.body;

    if (post.length > 2000){
		errors.push({msg: 'Please keep your post to 2000 characters or less.'})
	}

    const username = "admin";
    // if login
    if (username){
        Thread.create({
            title: title,
            post: post,
            username: username,
            category: category,
            timestamp: getToday(),
        })
        .then((thread) =>{
            res.redirect('/c/inbox/'+thread.id);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }
    else {
        alertMessage(res, 'danger', 'Access Denied, please login to proceed', 'fas fa-exclamation-triangle', true);
        res.redirect('back');
    }

});

// View Thread
router.get('/view_thread/:id', (req, res) => {
    Thread.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    })
    .then((threadDetails) => {
        if (threadDetails) {
            console.log(threadDetails)
            res.render('forum/view_thread', {
                title: "View thread - " + threadDetails.title,
                id: req.params.id,
                threadDetails: threadDetails
            });
        }
        else {
            res.redirect('/404');
        }
    })
});

function getToday(){
	// Get Date
	var currentdate = new Date(); 
	const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	var datetime = currentdate.getDate() + " "
			+ monthNames[currentdate.getMonth()]  + " " 
			+ currentdate.getFullYear() + " "  
			+ currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	return datetime;
}

module.exports = router;