// DB Table Connections
const Thread = require('../models/Thread');
const Post = require('../models/Post');

// Handlebars Helpers
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');

// Other Requires
const express = require('express');
const router = express.Router();

// Main Forums page
router.get('/', (req, res) => {
    // Thread Pagination - /forum?page=2
    var PAGE;
    if (!req.query.page) PAGE = 0;
    else PAGE = parseInt(req.query.page) - 1;
	const LIMIT = 6;

    Thread.findAll({ 
        isHidden: false, 
        offset: PAGE*6,
        limit: LIMIT,
        raw: true
    })
    .then((threads) => {
        console.log(threads)
        res.render('forum/main_page', { title: "Let's talk about mental health" })
    })
    .catch((error) => {
        console.error(error);
    })
    
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

    const username = "ducker";
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
            res.redirect('/forum/view_thread/'+thread.id);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }
    else {
        alertMessage(res, 'danger', 'Access Denied, please login to proceed', 'lnr lnr-cross', true);
        res.redirect('back');
    }

});

// View Thread
router.get('/view_thread/:id', (req, res) => {
    // Comments Pagination
    var PAGE;
    if (!req.query.page) PAGE = 0;
    else PAGE = parseInt(req.query.page) - 1;
	const LIMIT = 6; 

    Thread.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    })
    .then((threadDetails) => {
        if (threadDetails) {
            Post.findAndCountAll({
                where: { threadId: req.params.id, },
                offset: PAGE*6,
		        limit: LIMIT,
                raw: true
            })
            .then((posts) => {
                res.render('forum/view_thread', {
                    title: "View thread - " + threadDetails.title,
                    id: req.params.id,
                    threadDetails: threadDetails,
                    posts: posts.rows,
                    postCount: posts.count,
                    pagination: {
                        page: PAGE+1, // The current page the user is on
                        pageCount: Math.ceil(posts.count/LIMIT)  // The total number of available pages
                    }
                });
            })
        }
        else {
            res.redirect('/404');
        }
    })
});

// GET: Update Thread
router.get('/update_thread/:id', (req, res) => {
    const username = "admin"
    Thread.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    })
    .then((threadDetails) => {
        if (threadDetails) {
            if (threadDetails.username == username || username == "admin"){ //res.locals.user.username
                res.render('forum/update_thread', {
                    title: "Update thread",
                    threadDetails: threadDetails
                });
            }
            else {
                alertMessage(res, 'danger', 'The thread do not exists.', 'lnr lnr-file-empty', true);
                res.redirect('back');
            }
            
        }
        else {
            res.redirect('/404');
        }
    })
});

// PUT: Update Thread
router.post('/update_thread/:id', (req, res) => {
	let { post } = req.body;
    let errors = [];

    const username = "Admin"

	if (post.length > 2000){
		errors.push({msg: 'Please keep your review to 2000 characters or less.'})
	}

	if (errors.length == 0) {
		Thread.update({
            post: post,
            editTime: getToday(),
            editedBy: username
        }, {
            where: { id: req.params.id }
        })
            .catch(err => console.log(err));
        alertMessage(res, 'info', 'Successfully updated thread.', 'lnr lnr-smile', true);
        res.redirect('/forum/view_thread/' + req.params.id);
	}
});

// Delete Thread
router.get('/delete_thread/:id', (req, res) => {
    const username = "admin"
	Thread.findOne({
		where: {
			id: req.params.id
		},
		raw: true
	})
    .then((threads) => {
        if (threads && (threads.username == username || username == "admin")) {
            Post.destroy({
                where: {
                    threadId: req.params.id
                }
            })
            .then(() => {
                Thread.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(() => {
                        alertMessage(res, 'info', 'Successfully deleted thread.', 'lnr lnr-flag', true);
                        res.redirect('/forum');
                    })
            }) 
        }
        else {
            alertMessage(res, 'danger', 'You do not have permission to delete this review.', 'fas fa-exclamation-triangle', true);
            res.redirect('/404');
        }
    })
});

// POST: Create Post
router.post('/view_thread/:id', (req, res) => {
    let { post } = req.body;

    if (post.length > 2000){
		errors.push({msg: 'Please keep your post to 2000 characters or less.'})
	}

    const username = "ducker";
    // if login
    if (username){
        Post.create({
            post: post,
            username: username,
            timestamp: getToday(),
            threadId: req.params.id
        })
        .then(() =>{
            res.redirect('/forum/view_thread/'+req.params.id);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }
    else {
        alertMessage(res, 'danger', 'Access Denied, please login to proceed', 'lnr lnr-enter', true);
        res.redirect('back');
    }

});

// GET: Update Post
router.get('/update_post/:id', (req, res) => {
    const username = "admin"
    Post.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    })
    .then((postDetails) => {
        if (postDetails) {
            console.log(postDetails)
            if (postDetails.username == username || username == "admin"){ //res.locals.user.username
                res.render('forum/update_post', {
                    title: "Update post",
                    postDetails: postDetails
                });
            }
            else {
                alertMessage(res, 'danger', 'The post do not exists.', 'lnr lnr-unlink', true);
                res.redirect('back');
            }
            
        }
        else {
            res.redirect('/404');
        }
    })
});

// PUT: Update Post
router.post('/update_post/:id', (req, res) => {
	let { post, threadId } = req.body;
    let errors = [];

    const username = "Admin"

	if (post.length > 2000){
		errors.push({msg: 'Please keep your post to 2000 characters or less.'})
	}
    console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee " + threadId)

	if (errors.length == 0) {
		Post.update({
            post: post,
            editTime: getToday(),
            editedBy: username
        }, {
            where: { id: req.params.id }
        })
            .catch(err => console.log(err));
        alertMessage(res, 'info', 'Successfully updated thread.', 'lnr lnr-smile', true);
        res.redirect('/forum/view_thread/' + threadId);
	}
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