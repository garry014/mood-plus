// Handlebars Helpers
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth.js');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Feedback = require('../models/Feedback');
const User = require('../models/User.js');

// Other Requires
const express = require('express');
const router = express.Router();
const request = require('request');
const axios = require("axios");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validator = require("email-validator");

router.get('/', async (req, res) => {
    console.log("here")
    console.log(req.user)
    currentuser = req.user.dataValues.username
	User.findOne({
		where: {
			username: currentuser
		}
	})
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

// kj
// counsellor chat
router.get('/newchat', ensureAuthenticated, (req, res) => {
	currentuser = req.user.dataValues.username;
	sendername = (req.user.dataValues.firstname + " " + req.user.dataValues.lastname);
	recipientname = req.user.dataValues.firstname;
	counsellor = 'counsellor1'
	Chat.findOne({
		where: {
        	sender: currentuser
        },
		raw: true
		// include the extra table here  
	})
	.then(chats => {
		console.log(chats)
		if(chats){
			res.redirect('/chat/c/inbox/'+chats.id);
		} 
		else {
			Chat.create({
				sender : currentuser,
				recipient : counsellor,
				sendername: sendername,
				recipientname: "Sandra Tan"
			})
			.then(chat => {
				const data = {receiver: counsellor, sender: currentuser, chatid: chat.id};
				start_newchat(data);
				res.redirect('/chat/c/inbox/'+chat.id);
			})
			.catch(err => console.log(err));
		}
	});
});

router.get('/c/:chat/:id', ensureAuthenticated, (req, res) => { 
	if (typeof req.user != "undefined") {
		var currentuser;
		currentuser = req.user.dataValues.username;
		req.session.username = currentuser;
	}
	var recipient = "";
	const chatids = [];
	Chat.findAll({
		where: {
			[Op.or]: [{ sender: currentuser }, { recipient: currentuser }]
		},
		raw: true
	})
		.then((chats) => {
			User.findAll({
				attributes: ['username'],
				raw: true
			})
				.then(() => {
					// Error: something wrong when chatid > 1
					if (chats) {
						chatIdExist = false;
						// Need to extract ONLY one section of each chats object
						// & check if current webpage ID exists
						for (var c = chats.length - 1; c >= 0; c--) {
							console.log(chats[c].id, req.params.id);
							if (chats[c].id == req.params.id) { // 1 is static data
								chatIdExist = true;
								if (currentuser == chats[c].recipient) {
									recipient = chats[c].sender;
								}
								else {
									recipient = chats[c].recipient;
								}
							}
						};


						Message.findAll({
							where: {
								chatId: chatids
							},
							order: [
								['id', 'DESC'],
							],
							raw: true
						})
							.then((messageInChat) => {
								// Filter to get the greatest msg id FOR EACH chat id.
								const idcheck = {};
								for (var i in chatids){
									idcheck[chatids[i]] = [0]
								}
								console.log(idcheck);
								const checkedlist = [];
								for (var msg in messageInChat) {
									for (var i in idcheck) {
										if (messageInChat[msg].chatId == i && !checkedlist.includes(messageInChat[msg].chatId)) {
											idcheck[i][0] = messageInChat[msg].message;
											idcheck[i].push(messageInChat[msg].timestamp);
											checkedlist.push(messageInChat[msg].chatId);
										}
									}
								}
							

								console.log(chats);
							})
							.catch(err => {
								console.error('Unable to connect to the database:', err);
							});

						if (chatIdExist == true || req.params.id == "0") {
							Message.findAll({
								where: { chatId: req.params.id, }, // static data 
								raw: true
							})
								.then((messages) => {

									// Get every first message of the chat
									Message.findAll({
										where: { chatId: req.params.id, }, // static data 
										raw: true
									})
								

									res.render('chat/chatcounsellor', {
										title: "Chat",
										chats: chats,
										messages: messages,
										currentuser: currentuser,
										recipient: recipient,
										id: req.params.id,
									});
								})
								.catch(err => {
									console.error('Unable to connect to the database:', err);
								});
						}
						else {
							alertMessage(res, 'danger', 'Access Denied, you do not have permission to view message that is not yours.', 'fas fa-exclamation-triangle', true);
							res.redirect('/c/'+req.params.chat+'/0');
						}
					}
					else {
						res.render('chat/chatcounsellor', { title: "Chat" });
					}
				})


		})
		.catch(err => {
			console.error('Unable to connect to the database:', err);
		});

});

router.post('/c/:chat/:id', (req, res) => {
	console.log("dsfs")
	Message.create({
		sentby: currentuser,
		timestamp: datetime,
		message: data.message,
		chatId: data.chatid
	})
	.then(messages => {
		const data = {receiver: counsellor, sender: currentuser, chatid: chat.id};
		start_newchat(data);
		
		res.render('chat/chatcounsellor', {
			title: "Chat",
			chats: chats,
			messages: messages,
			currentuser: currentuser,
			recipient: recipient,
			id: req.params.id,
		});
		res.redirect('/chat/c/inbox/'+chat.id);
	})
	.catch(err => console.log(err));
});

router.get('/feedback', (req, res) => {
    res.render('chat/feedback', { title: "Feedback" })

});

// customer: create feedback
router.post('/feedback', async(req, res) => {
	let errors = [];
	let { title, name, email, aifunction, satisfaction, description } = req.body;
	fb = await classify_feedback(description);
	console.log(fb);
	if (validator.validate(req.body.email) == false) {
		errors.push({
			msg: 'Please enter valid email.'
		});
	}if (errors.length > 0) {
		res.render('chat/feedback', {
			errors: errors,
			title: "Feedback",
		});

	} else if (errors.length == 0) {
		Feedback.create({
			title,
			name, 
			email, 
			aifunction, 
			satisfaction, 
			description,
			timestamp: getToday(),
			status : "Unresolved",
			classification : fb
		}).then((feedbacks) => {
			res.redirect('/chat');
		}).catch(err => console.log(err))
	}
});
// feedback classification api
async function classify_feedback(text) {
    const apiKey = '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';

    return new Promise(res => {
        var options = {
            url : 'https://api.openai.com/v1/completions',
            json : true,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                // 'Content-Type': 'application/json'
            },
            body : {
                model: "text-davinci-003",
                prompt : `The following is different feedbacks and the categories they fall into:\nPositive, Negative, Constructive, Irrelevant\n\nCategorize\"${text}\":`, 
                temperature: 0.7,
                max_tokens: 50,
                top_p: 1.0,
                frequency_penalty: 1.0,
                presence_penalty: 1,
				stop: ["\n"],
            },
            method : 'post'
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res(body.choices[0].text)
            }

            if (response){
                console.log(`API error: ${response.statusCode} - ${error}`);
            }
            else{
                console.log(console.error());
            }
            res("");
        })
    });
}

// admin: view feedbacks
router.get('/allfeedbacks', ensureAuthenticated, (req, res) => {
	Feedback.findAll({
		raw: true,
	})
		.then((feedbacks) => {
			res.render('chat/allfeedbacks', {
				title: "View All Feedbacks",
				feedbacks: feedbacks
			});
		})
		.catch(err => console.log(err));
});

router.get('/viewfeedback/:id', (req, res) => {
    Feedback.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    })
	.then((feedbacks) => {
		res.render('chat/viewfeedback', {
			title: "View Feedback Details",
			feedbacks: feedbacks
		});
	})
	.catch(err => console.log(err));
});

function getToday() {
	// Get Date
	var currentdate = new Date();
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var datetime = currentdate.getDate() + " "
		+ monthNames[currentdate.getMonth()] + " "
		+ currentdate.getFullYear() + " "
		+ currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	return datetime;
}

module.exports = router;
