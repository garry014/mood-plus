const express = require('express');

const router = express.Router();

//db connections 
const User = require('../models/User');

// idk 
const Regex = require("regex");
const regex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
const validator = require("email-validator");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const passport = require('passport');
const e = require('connect-flash');
const FlashMessenger = require('flash-messenger');

// Handlebars Helpers
const alertMessage = require('../helpers/messenger');
const { username } = require('../config/db');
const ensureAuthenticated = require('../helpers/auth.js');


// customer: register
router.get('/register', (req, res) => {
	res.render('user/register');
});

// customer : register 
// add the account type for the various users  ?????????
router.post('/register', (req, res) => {
	console.log("dsfs")
	let errors = [];
	let { firstname, lastname, username, password, password2, gender, email, phoneno, usertype } = req.body;
	// Minimum eight characters with at least one uppercase letter, one lowercase letter, one number and one special character
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	console.log(firstname, "-" , password )
	// Checks if both passwords entered are the same
	if (req.body.password != req.body.password2) {
		errors.push({
			msg: 'Passwords do not match.'
		});
	}
	// Checks that password length is more than 8 
	if (req.body.password.length < 8) {
		errors.push({
			msg: 'Password must be at least 8 characters.'
		});
	}
	// validation for email
	if (validator.validate(req.body.email) == false) {
		errors.push({
			msg: 'Please enter valid email.'
		});
	}
	// regex.test(req.body.password)
	// password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
	// validation for password 
	if (regex.test(req.body.password) == false) {
		errors.push({
			msg: 'Password must contain at least eight characters with at least one uppercase letter, one lowercase letter, one number and one special character.'
		});
	}
	//validation for phone no.
	if (! /^[0-9]{8}$/.test(req.body.phoneno)) {
		errors.push({
			msg: 'Phone Number have to consist of 8 digits.'
		});
	}
	
	console.log(errors)
	if (errors.length > 0) {
		console.log("line78");
		res.render('user/register', {
			errors: errors,
			firstname,
			lastname,
			username,
			password,
			password2,
			gender,
			email,
			phoneno,
			usertype
		});
	} else {
		User.findOne({
			where: {
				usertype: 'customer',
				[Op.or]: [{ email: req.body.email }, { username: req.body.username }]
			},
			// include the extra table here  
		})
			.then(Customer => {
				if (Customer) {
					console.log("line101");
					res.render('user/register', {
						error: 'User has already registered or email has been used.',
						firstname,
						lastname,
						username,
						password,
						password2,
						email,
						phoneno,
						//photo,
						usertype
					});
				} else {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							password = hash;
							User.create({ firstname, lastname, username, password, gender, email, phoneno, usertype: 'customer', chat: 'Hidden'  })
								.then(user => {
									alertMessage(res, 'success', user.username + ' account created successfully. Please proceed to login', 'fas fa-sign-in-alt', true);
									res.redirect('/user/login');
								})
								.catch(err => console.log(err));
						})
					});
				}
			});
	}
});

////////////////////////////////////////////
// admin : register
router.get('/registeradmin', (req, res) => {
	res.render('user/registeradmin');
});

// admin : register 
// add the account type for the various users  ?????????
router.post('/registeradmin', (req, res) => {
	console.log("dsfs")
	let errors = [];
	let { firstname, lastname, username, password, password2, gender, email, phoneno, usertype } = req.body;
	// Minimum eight characters with at least one uppercase letter, one lowercase letter, one number and one special character
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	console.log(firstname, "-" , password )
	// Checks if both passwords entered are the same
	if (req.body.password != req.body.password2) {
		errors.push({
			msg: 'Passwords do not match.'
		});
	}
	// Checks that password length is more than 8 
	if (req.body.password.length < 8) {
		errors.push({
			msg: 'Password must be at least 8 characters.'
		});
	}
	// validation for email
	if (validator.validate(req.body.email) == false) {
		errors.push({
			msg: 'Please enter valid email.'
		});
	}
	// regex.test(req.body.password)
	// password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
	// validation for password 
	if (regex.test(req.body.password) == false) {
		errors.push({
			msg: 'Password must contain at least eight characters with at least one uppercase letter, one lowercase letter, one number and one special character.'
		});
	}
	//validation for phone no.
	if (! /^[0-9]{8}$/.test(req.body.phoneno)) {
		errors.push({
			msg: 'Phone Number have to consist of 8 digits.'
		});
	}

	console.log(errors)
	if (errors.length > 0) {
		console.log("line78");
		res.render('user/registeradmin', {
			errors: errors,
			firstname,
			lastname,
			username,
			password,
			password2,
			gender,
			email,
			phoneno,
			//photo,
			usertype
		});
	} else {
		User.findOne({
			where: {
				usertype: 'customer',
				[Op.or]: [{ email: req.body.email }, { username: req.body.username }]
			},
			// include the extra table here  
		})
			.then(Admin => {
				if (Admin) {
					console.log("line101");
					res.render('user/registeradmin', {
						error: 'User has already registered or email has been used.',
						firstname,
						lastname,
						username,
						password,
						password2,
						email,
						phoneno,
						//photo,
						usertype
					});
				} else {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							password = hash;
							User.create({ firstname, lastname, username, password, gender, email, phoneno, usertype: 'admin' })
								.then(user => {
									alertMessage(res, 'success', user.username + ' admin account created successfully. Please proceed to login', 'fas fa-sign-in-alt', true);
									res.redirect('/user/loginadmin');
								})
								.catch(err => console.log(err));
						})
					});
				}
			});
	}
});

////////////////////////////////////////////
// counsellor : register
router.get('/registercounsellor', (req, res) => {
	res.render('user/registercounsellor');
});

// counsellor : register 
// add the account type for the various users  ?????????
router.post('/registercounsellor', (req, res) => {
	console.log("dsfs")
	let errors = [];
	let { firstname, lastname, username, password, password2, gender, email, phoneno, usertype } = req.body;
	// Minimum eight characters with at least one uppercase letter, one lowercase letter, one number and one special character
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	console.log(firstname, "-" , password )
	// Checks if both passwords entered are the same
	if (req.body.password != req.body.password2) {
		errors.push({
			msg: 'Passwords do not match.'
		});
	}
	// Checks that password length is more than 8 
	if (req.body.password.length < 8) {
		errors.push({
			msg: 'Password must be at least 8 characters.'
		});
	}
	// validation for email
	if (validator.validate(req.body.email) == false) {
		errors.push({
			msg: 'Please enter valid email.'
		});
	}
	// regex.test(req.body.password)
	// password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
	// validation for password 
	if (regex.test(req.body.password) == false) {
		errors.push({
			msg: 'Password must contain at least eight characters with at least one uppercase letter, one lowercase letter, one number and one special character.'
		});
	}
	//validation for phone no.
	if (! /^[0-9]{8}$/.test(req.body.phoneno)) {
		errors.push({
			msg: 'Phone Number have to consist of 8 digits.'
		});
	}
	
	console.log(errors)
	if (errors.length > 0) {
		console.log("line78");
		res.render('user/registercounsellor', {
			errors: errors,
			firstname,
			lastname,
			username,
			password,
			password2,
			gender,
			email,
			phoneno,
			//photo,
			usertype
		});
	} else {
		User.findOne({
			where: {
				usertype: 'customer',
				[Op.or]: [{ email: req.body.email }, { username: req.body.username }]
			},
			// include the extra table here  
		})
			.then(Customer => {
				if (Customer) {
					console.log("line101");
					res.render('user/registercounsellor', {
						error: 'User has already registered or email has been used.',
						firstname,
						lastname,
						username,
						password,
						password2,
						email,
						phoneno,
						//photo,
						usertype
					});
				} else {
					
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							password = hash;
							User.create({ firstname, lastname, username, password, gender, email, phoneno, usertype: 'counsellor' })
								.then(user => {
									alertMessage(res, 'success', user.username + ' counsellor account created successfully. Please proceed to login', 'fas fa-sign-in-alt', true);
									res.redirect('/user/logincounsellor');
								})
								.catch(err => console.log(err));
						})
					});
				}
			});
	}
});




// customer : login
router.get('/login', (req, res) => {
	res.render('user/login', {user: req.user});
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/user/login', // Route to /login URL
		failureFlash: 'Invalid username or password.',
		userProperty: res.user
	})
		(req, res, next);
});


// profile ensureAuthenticated
router.get('/profile/:id',  ensureAuthenticated, (req, res)=> {
	console.log("in here 182")
	User.findOne({
		where: {
			id: req.user.dataValues.id,
		},
		raw: true
	}).then((Customer) => {
		if (!Customer) {
			alertMessage(res, 'danger', 'Access Denied', 'fas fa-exclamation-circle', true);
			req.logout();
			res.redirect('/');
		}
		else {
			console.log("196")
			if (req.params.id == Customer.id) {
				res.render('user/profile', {
					User: Customer,
					user: req.user
				});
			}
			else {
				alertMessage(res, 'danger', 'Access Denied', 'fas fa-exclamation-circle', true);
				req.logout();
				res.redirect('/');
			}
		}
	}).catch(err => console.log(err));
});

router.put('/profile/:id', (req, res) => {
	let errors = [];  // id is course id
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let email = req.body.email;
	let phoneno = req.body.phoneno;

	//validation----------------------------------------------
	console.log(req.body.firstname, " |here| ")
	console.log(req.body.lastname, " |here| ")
	
	if (req.body.firstname.length < 1) {
		//errors.push({ msg: "Title must be at least 5 characters." });
		alertMessage(res, 'danger', 'First name must be at least 1 character.', false);
		errors.push(1);
	}
	if (req.body.lastname.length < 1) {
		//errors.push({ msg: "Materials needed description must be at least 10 characters." });
		alertMessage(res, 'danger', 'Last name must be at least 1 character.', false);
		errors.push(1);
	}
	if (validator.validate(req.body.email) == false) {
		alertMessage(res, 'danger',
			'Please enter valid email.', 'fas fa-exclamation-circle', false);
		errors.push(1);
	} else {
		User.findOne({
			where: {
				email: req.body.email, usertype: 'customer'
			}
		})
			.then(Customer => {
				if (Customer) {
					alertMessage(res, 'danger', 'This email address has already been used.',  false);
					errors.push(1);
				} 
			});
	}
	if (! /^[0-9]{8}$/.test(req.body.phoneno)) {
		alertMessage(res, 'danger',
			'Phone number has to be 8 digits.', 'fas fa-exclamation-circle', false);
		errors.push(1);
	}
	console.log(errors)


	if (errors.length > 0) {
		res.render('/user/profile/' + req.params.id, {
			errors: errors,
			firstname,
			lastname,
			email,
			phoneno,
		});
	}
	else {
		User.update({
			firstname: firstname,
			lastname: lastname,
			email: email,
			phoneno: phoneno
		}, {
			where: {
				id: req.params.id
			}
		}).then(() => {
			alertMessage(res, 'success', 'Your details has been updated successfully!', 'fas fa-sign-in-alt', true);
			res.redirect('/user/profile/' + req.params.id);
			// videos
		}).catch(err => console.log(err));
		}

});



router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');

});

//delete account
router.post('/deleteaccount/:id', ensureAuthenticated, (req, res) => {
	User.findOne({
		where: {
			id: req.params.id, //COURSE ID
			// user: res.locals.user.id
		},
		raw: true
		// attributes: ['id']
	}).then((user) => { // if record is found, user is owner of video
		console.log("396: " ,user)
		if (user) {
			User.destroy({
				where: {
					id: req.params.id
				}
			}).then(() => {
				alertMessage(res, 'success', 'Account has been deleted successfully', 'far fa-trash-alt', true);
				res.redirect('/'); // To retrieve all videos again
			}).catch(err => console.log(err));
		} else {
			alertMessage(res, 'danger', 'Unauthorised access to course', 'fas fa-exclamation-circle', true);
			res.redirect('/');
		}
	});
});


module.exports = router;
