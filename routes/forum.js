// DB Table Connections
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const Report = require('../models/Report');

// Handlebars Helpers
const alertMessage = require('../helpers/messenger');

// Realtime transcript
const axios = require('axios');
const cors = require('cors');

// Other Requires
const express = require('express');
const router = express.Router();
const request = require('request');
const smartSearch = require('smart-search');
const { where } = require('sequelize');

// Main Forums page
router.get('/', (req, res) => {
    // Thread Pagination - /forum?page=2&category=Others
    var PAGE;
    if (!req.query.page) PAGE = 0;
    else PAGE = parseInt(req.query.page) - 1;
    if (PAGE < 0) PAGE = 0;
	const LIMIT = 6;

    // Category
    const CATEGORIES = ["Experiences", "Grief", "Abuse", "Relationships", "Others"];
    var whereClause = { };
    if (req.query.category && CATEGORIES.includes(req.query.category)) {
        whereClause["category"] = req.query.category
    } 

    // Filters
    var filterAction;
    if (req.query.filter) {
        if (req.query.filter == "open") {
            whereClause["isClosed"] = false;
            filterAction = "open";
        }
        else if (req.query.filter == "closed") {
            whereClause["isClosed"] = true;
            filterAction = "closed";
        }
    }

    Thread.findAll({ 
        where: whereClause,
        order: [
            ['id', 'DESC']
        ],
        offset: PAGE*6,
        limit: LIMIT,
        raw: true
    })
    .then((threads) => {
        const threadsCount = threads.length;
        const max_pages = Math.ceil(threadsCount/6);

        if (PAGE > max_pages) {
            res.redirect('/404');
        }
        else {
            res.render('forum/main_page', {
                title: "Let's talk about mental health",
                threads: threads,
                threadsCount: threadsCount,
                categories: CATEGORIES,
                filter: filterAction,
                pagination: {
                    page: PAGE+1, // The current page the user is on
                    pageCount: Math.ceil(threadsCount/LIMIT)  // The total number of available pages
                }
            });
        }
    })
    .catch((error) => {
        console.error(error);
    })
    
});

// POST: Search on main forums page
router.post('/', async (req, res) => {
	let { searchText } = req.body;
    let errors = [];

    console.log(searchText)

    Thread.findAll({ 
        raw: true
    })
    .then((threads) => {
        var searchResults = smartSearch(threads, [searchText], {title: true, post: true});
        //console.log(searchResults);

        if (searchResults.length) {
            for (i in searchResults){
                searchResults[i] = searchResults[i]["entry"]
            }
        }

        res.render('forum/main_page', {
            title: "Let's talk about mental health",
            threads: searchResults,
            searchText: searchText,
            categories: ["Experiences", "Grief", "Abuse", "Relationships", "Others"],
            pagination: {
                page: 1, // The current page the user is on
                pageCount: 1  // The total number of available pages
            }
        });
    });

    
});

async function get_classification(post) {
    return new Promise(res => {
        var options = {
            url : 'http://127.0.0.1:5000/classifyPost',
            json : true,
            body : {
                comment : post
            },
            method : 'post'
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.result.toString())
                res(body.result.toString())
            }

            if (response){
                console.log(`model error: ${response.statusCode} - ${error}`);
            }
            else{
                console.log(console.error());
            }
            res("");
        })
    });
}

// GET: Create Thread
router.get('/create_thread', (req, res) => {
    res.render('forum/create_thread', { title: "Create new thread" })
});

// POST: Create Thread
router.post('/create_thread', async (req, res) => {
    let { title, post, category } = req.body;
    let errors = [];
    const username = "ducker";

    if (title.length <=5) {
        errors.push({msg: 'Thread title should be at least 5 letters or more.'})
    }
    if (title.length > 2000){
		errors.push({msg: 'Please keep your title to 2000 characters or less.'})
	}
    if (post.length <=10){
        errors.push({msg: 'Thread body should be at least 10 letters or more.'})
    }
    if (post.length > 2000){
		errors.push({msg: 'Please keep your post to 2000 characters or less.'})
	}
    if (category.length < 5) {
        errors.push({msg: 'Category should not be empty.'})
    }
    if (!username){
        alertMessage(res, 'danger', 'Access Denied, please login to proceed', 'alert_icon lnr lnr-warning', true);
        res.redirect('back');
    }

    let classificationResults = await get_classification(post);
    // if login
    if (errors.length > 0){
        res.render('forum/create_thread', { 
            errors: errors,
            thread_title: title,
            post: post,
            category: category,
            title: "Create new thread" 
        })
    }
    else {
        Thread.create({
            title: title,
            post: post,
            username: username,
            category: category,
            hiddenReason: classificationResults,
            timestamp: getToday(),
        })
        .then((thread) =>{
            console.log(classificationResults)
            res.redirect('/forum/view_thread/'+thread.id);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }
});

// View Thread
router.get('/view_thread/:id', (req, res) => {
    // Comments Pagination
    var PAGE;
    if (!req.query.page) PAGE = 0;
    else PAGE = parseInt(req.query.page) - 1;
    if (PAGE < 0) PAGE = 0;
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
                const max_pages = Math.ceil(parseInt(posts.count)/6);
                if (PAGE > max_pages) {
                    res.redirect('/404');
                }
                else {
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
                }
                
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
                alertMessage(res, 'danger', 'The thread do not exists.', 'alert_icon lnr lnr-warning', true);
                res.redirect('back');
            }
            
        }
        else {
            res.redirect('/404');
        }
    })
});

// POST: Update Thread
router.post('/update_thread/:id', async (req, res) => {
	let { post } = req.body;
    let errors = [];
    const username = "Admin"

    if (post.length <=10){
        errors.push({msg: 'Thread body should be at least 10 letters or more.'})
    }
    if (post.length > 2000){
		errors.push({msg: 'Please keep your post to 2000 characters or less.'})
	}
    if (!username){
        alertMessage(res, 'danger', 'Access Denied, please login to proceed', 'alert_icon lnr lnr-warning', true);
        res.redirect('back');
    }
    
    let classificationResults = await get_classification(post);

	if (errors.length > 0) {
		Thread.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        .then((threadDetails) => {
            if (threadDetails) {
                threadDetails.post = post;
                res.render('forum/update_thread', {
                    title: "Update thread",
                    errors: errors,
                    threadDetails: threadDetails
                });
            }
            else {
                res.redirect('/404');
            }
        })
	}
    else {
        Thread.update({
            post: post,
            hiddenReason: classificationResults,
            editTime: getToday(),
            editedBy: username
        }, {
            where: { id: req.params.id }
        })
            .catch(err => console.log(err));
        alertMessage(res, 'success', 'Successfully updated thread.', 'alert_icon lnr lnr-checkmark-circle', true);
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
                        alertMessage(res, 'success', 'Successfully deleted thread.', 'alert_icon lnr lnr-checkmark-circle', true);
                        res.redirect('/forum');
                    })
            }) 
        }
        else {
            alertMessage(res, 'danger', 'You do not have permission to delete this thread.', 'alert_icon lnr lnr-warning', true);
            res.redirect('/404');
        }
    })
});

// POST: Create Post
router.post('/view_thread/:id', async (req, res) => {
    let { post, postCount } = req.body;
    let errors = [];
    const username = "ducker";

    if (post.length <=10){
        errors.push({msg: 'Post should be at least 10 letters or more.'})
    }
    if (post.length > 2000){
		errors.push({msg: 'Please keep your post to 2000 characters or less.'})
	}
    if (!username){
        alertMessage(res, 'danger', 'Access Denied, please login to proceed', 'alert_icon lnr lnr-warning', true);
        res.redirect('back');
    }

    pageNum = Math.ceil((parseInt(postCount)+1)/6);

    let classificationResults = await get_classification(post);

    // if login
    if (errors.length > 0){
        alertMessage(res, 'danger', 'Post should be at least 10 letters or more.', 'alert_icon lnr lnr-warning', true);
        res.redirect('back');
    }
    else {
        Post.create({
            post: post,
            username: username,
            timestamp: getToday(),
            hiddenReason: classificationResults,
            threadId: req.params.id
        })
        .then(() =>{
            res.redirect('/forum/view_thread/'+req.params.id+"?page="+pageNum);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
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
                alertMessage(res, 'danger', 'The post do not exists.', 'alert_icon lnr lnr-warning', true);
                res.redirect('back');
            }
            
        }
        else {
            res.redirect('/404');
        }
    })
});

// POST: Update Post
router.post('/update_post/:id', (req, res) => {
	let { post, threadId } = req.body;
    let errors = [];

    const username = "Admin"

    if (post.length <=10){
        errors.push({msg: 'Thread body should be at least 10 letters or more.'})
    }
    if (post.length > 2000){
		errors.push({msg: 'Please keep your post to 2000 characters or less.'})
	}

	if (errors.length > 0) {
		alertMessage(res, 'danger', 'Post should have at least 10 characters, but less than 2000 characters.', 'alert_icon lnr lnr-warning', true);
        res.redirect('back');
	}
    else {
        Post.update({
            post: post,
            editTime: getToday(),
            editedBy: username
        }, {
            where: { id: req.params.id }
        })
        .then (() =>{
            console.log('/forum/view_thread/' + threadId)
            alertMessage(res, 'success', 'Successfully updated thread.', 'alert_icon lnr lnr-checkmark-circle', true);
            res.redirect('/forum/view_thread/' + threadId);
        })
        .catch(err => console.log(err));
    }
});

// Delete Post
router.get('/delete_post/:id', (req, res) => {
    const username = "ducker"
	Post.findOne({
		where: {
			id: req.params.id
		},
		raw: true
	})
    .then((posts) => {
        if (posts && (posts.username == username || username == "admin")) {
            Post.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(() => {
                alertMessage(res, 'success', 'Successfully deleted post.', 'alert_icon lnr lnr-checkmark-circle', true);
                res.redirect('/forum/view_thread/' + posts.threadId);
            })
        }
        else {
            alertMessage(res, 'danger', 'You do not have permission to delete this post.', 'alert_icon lnr lnr-warning', true);
            res.redirect('/404');
        }
    })
});

// GET: Update Thread/Post Appeal
router.get('/appeal/:type/:id', (req, res) => {
    var type = req.params.type
    const username = "ducker"
    
    if (type == "thread"){
        Thread.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        .then((details) => {
            if (details && details.hiddenReason) {
                res.render('forum/appeal', { 
                    title: "Make an Appeal",
                    details: details
                })
            }
            else {
                res.redirect('/404');
            }
        })
    }
    else if (type == "post") {
        Post.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        .then((details) => {
            if (details && details.hiddenReason) {
                res.render('forum/appeal', { 
                    title: "Make an Appeal",
                    details: details
                })
            }
            else {
                res.redirect('/404');
            }
        })
    }
    else {
        res.redirect('/404')
    }
});

// POST: Update Thread/Post Appeal
router.post('/appeal/:type/:id', async (req, res) => {
    let { post } = req.body;
    let errors = [];
    const username = "ducker";

    if (post.length > 2000){
		res.redirect('back');
	}
    else if (req.params.type == "thread"){
        Thread.update({
            vettingRequest: "pending"
        }, {
            where: { id: req.params.id }
        })
        .then(() => {
            alertMessage(res, 'success', 'Successfully submitted appeal request. Pending for moderator approval.', 'alert_icon lnr lnr-checkmark-circle', true);
            res.redirect('/forum');
        })
        .catch(err => console.log(err));
    }
    else if (req.params.type == "post"){
        Post.update({
            vettingRequest: "pending"
        }, {
            where: { id: req.params.id }
        })
        .then(() => {
            alertMessage(res, 'success', 'Successfully submitted appeal request. Pending for moderator approval.', 'alert_icon lnr lnr-checkmark-circle', true);
            res.redirect('/forum');
        })
        .catch(err => console.log(err));
    }
    else {
        res.redirect('/404')
    }
})

// GET: Appeal Requests
router.get('/moderate_appeals', (req, res) => {
    const username = "ducker"

    Thread.findAll({ 
        where: {
            vettingRequest: "pending"
        },
        raw: true
    })
    .then((threads) => {
        Post.findAll({ 
            where: {
                vettingRequest: "pending"
            },
            raw: true
        })
        .then((posts) => {
            res.render('forum/moderate_appeals', { 
                title: "Appeal requests",
                threads: threads,
                posts: posts
            })
        })
    })
});

// GET: Accept Appeal Request
router.get('/set_appeal/:grant/:type/:id', (req, res) => {
    const username = "ducker"
    console.log("hello")
    console.log(req.params.type, req.params.id)

    const whereClause = {
        where: { id: req.params.id }
    }
    var updateQuery = {
        vettingRequest: req.params.grant
    }
    if (req.params.grant == "accepted") {
        updateQuery["hiddenReason"] = ""
    }

    if (req.params.type == "thread"){
        Thread.update(updateQuery, whereClause)
        .then(() => {
            res.redirect('/forum/moderate_appeals')
        })
        .catch(err => console.log(err));
    }
    else if (req.params.type == "post"){
        Post.update(updateQuery, whereClause)
        .then(() => {
            res.redirect('/forum/moderate_appeals')
        })
        .catch(err => console.log(err));
    }
    else {
        res.redirect('/404')
    }
    
});

// GET: Report Thread/Post Page
router.get('/report/:type/:id', (req, res) => {
    var type = req.params.type
    const username = "ducker"
    
    if (type == "thread"){
        Thread.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        .then((details) => {
            if (details) {
                res.render('forum/report', { 
                    title: "Report Thread",
                    details: details
                })
            }
            else {
                res.redirect('/404');
            }
        })
    }
    else if (type == "post") {
        Post.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        .then((details) => {
            if (details) {
                res.render('forum/report', { 
                    title: "Report Post",
                    details: details
                })
            }
            else {
                res.redirect('/404');
            }
        })
    }
    else {
        res.redirect('/404')
    }
});

function parseClassificationReport(classification) {
    if (typeof classification === 'string') {
        return classification
    }
    return classification.join()
}

// POST: Report Thread/Post
router.post('/report/:type/:id', async (req, res) => {
    let { post, classification } = req.body;
    const username = "ducker";

    if (!classification) {
        alertMessage(res, 'danger', 'You must provide at least 1 reason of why you are reporting the thread/post', 'alert_icon lnr lnr-warning', true);
        res.redirect('back');
    }
    else if (post.length > 2000){
		res.redirect('back');
	}
    else if (req.params.type == "thread"){
        Report.create({
            type: "thread",
            postId: req.params.id,
            post: post,
            reportedBy: username,
            classification: parseClassificationReport(classification),
            timestamp: getToday(),
        })
        .then(() => {
            alertMessage(res, 'success', 'Successfully submitted report. Pending for moderator vetting.', 'alert_icon lnr lnr-checkmark-circle', true);
            res.redirect('/forum');
        })
        .catch(err => console.log(err));
    }
    else if (req.params.type == "post"){
        Report.create({
            type: "post",
            postId: req.params.id,
            post: post,
            reportedBy: username,
            classification: parseClassificationReport(classification),
            timestamp: getToday(),
        })
        .then(() => {
            alertMessage(res, 'success', 'Successfully submitted report. Pending for moderator vetting.', 'alert_icon lnr lnr-checkmark-circle', true);
            res.redirect('/forum');
        })
        .catch(err => console.log(err));
    }
    else {
        res.redirect('/404')
    }
})

// GET: Appeal Requests
router.get('/moderate_reports', (req, res) => {
    const username = "ducker"

    Report.findAll({ 
        where: {
            isVetted: false
        },
        raw: true
    })
    .then((reports) => {
        res.render('forum/moderate_reports', { 
            title: "Report requests",
            reports: reports,
        })
    })
});

// GET: Accept Appeal Request
router.get('/set_report/:grant/:type/:id', (req, res) => {
    const username = "ducker"
    console.log(req.params.type, req.params.id)

    Report.update({
        isVetted: true
    }, {
        where: { id: req.params.id }
    })
    .then(() => {
        Report.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        .then((report) => {
            const updateQuery = {
                hiddenReason: report.classification
            }
    
            const whereClause = {
                where: {
                    id: report.postId
                }
            }
            console.log(report.postId, report.classification)
            
            // TODO: some issues here
            if (req.params.type == "thread"){
                Thread.update(updateQuery, whereClause)
                .then(() => {
                    res.redirect('/forum/moderate_reports')
                })
                .catch(err => console.log(err));
            }
            else if (req.params.type == "post"){
                Post.update(updateQuery, whereClause)
                .then(() => {
                    res.redirect('/forum/moderate_reports')
                })
                .catch(err => console.log(err));
            }
            else {
                res.redirect('/404')
            }

        })
    })
    .catch(err => console.log(err));

    
    
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

router.get('/speechToText', async (req, res) => {
    try {
        const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
            { expires_in: 3600 }, // can set a TTL timer in seconds.
            { headers: { authorization: '8c956f51c71f4887b7f99006049dd595' } }
        ); 
        const { data } = response;
        // console.log(data);
        console.log("Please dont spam this speech to text feature, it's pay per use :/")
        res.json(data);
    } catch (error) {
      const {response: {status, data}} = error;
      res.status(status).json(data);
    }
});

module.exports = router;
