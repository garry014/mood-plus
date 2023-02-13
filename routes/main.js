const express = require('express');
const router = express.Router();

const alertMessage = require('../helpers/messenger');

// Home Page
router.get('/', (req, res) => {
	const title = 'Mood+';
	res.render('index', { title: title })
});

router.get('/others', (req, res) => {
	const title = 'Other Helplines';
	res.render('otherhelp', { title: title })
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// Display About Page
router.get('/about', (req, res) => {
	let pDeveloperName = "😊 Test";


	alertMessage(res, 'success',
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);


	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';

	let pErrors = [
		{ textP: 'This is 1st message' },
		{ textP: 'This is 2nd object message' }
	];

	res.render('about', {
		developerName: pDeveloperName,
		success_msg: success_msg,
		error_msg: error_msg,
		errors: pErrors
	}) // 
});



module.exports = router;
