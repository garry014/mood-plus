/*
* 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
* in this JS file.
* */
const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Messaging Libraries
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger'); // add this require

// stacey add for login
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const generator = require('generate-password');
// dk if need
const { OAuth2Client, IdTokenClient } = require('google-auth-library');
const client = new OAuth2Client(IdTokenClient);

// stacey add for model
const request = require('request');

/*
* Loads routes file main.js in routes directory. The main.js determines which function
* will be called based on the HTTP request and URL.
*/
const mainRoute = require('./routes/main');
const forumRoute = require('./routes/forum'); // Add this line
const chatRoute = require('./routes/chat');
const userRoute = require('./routes/user');

/*
* Creates an Express server - Express is a web application framework for creating web applications
* in Node JS.
*/
const app = express();
const http = require("http").createServer(app);

// Handlebars Middleware
/*
* 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Handlebars files under the views directory
*
* 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
*
* */
app.engine('handlebars', exphbs({
	defaultLayout: 'main' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

const Handlebars = require('handlebars');
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
	switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '!=':
			return (v1 != v2) ? options.fn(this) : options.inverse(this);
		case '!==':
			return (v1 !== v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
	}
});

Handlebars.registerHelper('eq', (a, b) => a == b);

var paginate = require('handlebars-paginate');
Handlebars.registerHelper('paginate', paginate);

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
// app.use(session({
// 	key: 'vidjot_session',
// 	secret: 'tojiv',
// 	resave: false,
// 	saveUninitialized: false,
// }));

//stacey added
const MySQLStore = require('express-mysql-session');
const db = require('./config/db'); // db.js config file

app.use(session({
	key: 'vidjot_session',
	secret: 'tojiv',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		// How frequently expired sessions will be cleared; milliseconds:
		checkExpirationInterval: 9000000,
		// The maximum age of a valid session; milliseconds:
		expiration: 9000000,
	}),
	resave: false,
	saveUninitialized: false,
}));
const sharedsession = require("express-socket.io-session");

// stacey stop add

app.use(flash());
app.use(FlashMessenger.middleware); // add this statement after flash()

// stacey add user auth

// app.use(require('serve-static')(__dirname + '/../../public'));
app.use(passport.initialize());
app.use(passport.session());
const authenticate = require('./config/passport');
const User = require('./models/User');
authenticate.localStrategy(passport);

// stacey stop add user auth


// Place to define global variables
app.use(function (req, res, next) {
	// User Details
	if (typeof req.user != "undefined") {
		res.locals.user = req.user.dataValues || null;
	}
	// //session
	// if (typeof req.sess != "undefined") {
	// 	res.locals.sess = req.user.dataValues || null;
	// }
	next();
});

// Use Routes
/*
* Defines that any root URL with '/' that Node JS receives request from, for eg. http://localhost:5000/, will be handled by
* mainRoute which was defined earlier to point to routes/main.js
* */
app.use('/', mainRoute);
app.use('/forum', forumRoute); // Add this line
app.use('/chat', chatRoute);
app.use('/user', userRoute);


////////////////////////////// GOOGLE & FACEBOOK LOGIN STACEY ////////////////////////////////////

// google login
passport.use(new GoogleStrategy({
	//old
	// clientID: '601670228405-m3un3mco0q1q9faa22ho21e1g5abtd1j.apps.googleusercontent.com',
	// clientSecret: 'LB_jS4hb3y_jYxTWnKAhr0P8',
	clientID: '301198186348-f787fhi2ml6n9i5nns2lh20flpqlfmlq.apps.googleusercontent.com',
	clientSecret: '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',
	callbackURL: "http://localhost:5000/auth/google/"
},
	function (accessToken, refreshToken, profile, cb) {
		User.findOne({ where: { username: profile.id, google_id: profile.id, usertype: 'customer' } })
			.then(Customer => {
				if (Customer) {
					cb(null, Customer);
				}
				else {
					console.log(profile);
					let firstname = profile.displayName.split(' ')[0];
					let lastname = profile.displayName.split(' ')[1];
					var password = generator.generate({
						length: 10,
						numbers: true
					});
					// console.log('passsssssworrrdddd',password);
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							password = hash;
							User.create({ username: profile.id, firstname: firstname, lastname: lastname, google_id: profile.id, usertype: 'customer', password: password })
								.then(user => {
									cb(null, user);
								})
								.catch(err => console.log(err));
						})
					});
				}
			});
	}
));

app.get("/auth/google", passport.authenticate("google", { scope: ['profile'] }),
	function (req, res) {
		res.redirect('/')
	}
);


app.get("/auth/google/", passport.authenticate("google", { failureRedirect: "/user/login" }),
	function (req, res) {
		res.redirect('/')
	}
)

// facebook login
passport.use(new FacebookStrategy({
	clientID: '1232772963972757',
	clientSecret: 'be172bef27e79bb2dc362c41476717ff',
	callbackURL: "http://localhost:5000/auth/facebook/"
},
	function (accessToken, refreshToken, profile, done) {
		console.log('facebook-->', profile);

		User.findOne({ where: { facebook_id: profile.id, usertype: 'customer' } })
			.then(Customer => {
				if (Customer) {
					done(null, Customer);
				}
				else {
					let firstname = profile.displayName.split(' ')[0];
					let lastname = profile.displayName.split(' ')[1];
					var password = generator.generate({
						length: 10,
						numbers: true
					});
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							password = hash;
							User.create({ username: profile.id, firstname: firstname, lastname: lastname, facebook_id: profile.id, usertype: 'customer', password: password })
								.then(user => {
									// alertMessage(res, 'success', user.username + ' Please proceed to login', 'fas fa-sign-in-alt', true);
									// res.redirect('customer/homecust');
									done(null, user);
								})
								.catch(err => console.log(err));
						})
					});
				}
			});
	}
));

app.get('/auth/facebook', passport.authenticate('facebook'),
	function (req, res) {
		res.redirect('/')
	}
);


app.get('/auth/facebook/',
	passport.authenticate('facebook', {
		// successRedirect: '/customer/homecust',
		failureRedirect: '/user/login'
	}),
	function (req, res) {
		res.redirect('/')
	}
);

////////////////////////////// GOOGLE & FACEBOOK LOGIN STACEY END ////////////////////////////////////


// Create socket instance
const io = require('socket.io')(http);
var users = [];

////////////////////////////// CHAT/SOCKET.IO KJ & STACEY ////////////////////////////////////
function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

// stacey model
async function get_chatbot_response(msg) {
    return new Promise(res => {
        var options = {
            url : 'http://127.0.0.1:5000/chatbot',
            json : true,
            body : {
                user_respond : msg
            },
            method : 'post'
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.result.toString())
                res(body.result.toString())
            }
            if (response){
                console.log(`${response.statusCode} - ${error}`);
            }
            else{
                console.log(console.error());
            }
            res("");
        })
    });
}

// io.use(sharedsession(session));
// add listener for new connection
io.eio.pingTimeout = 60000;
io.on("connection", async function(socket){
	console.log("user connected: ", ) //"'\x1b[36m%s\x1b[0m'",;
	
	///////////////////////stacey added/////////////////////////////
	console.log("'\x1b[36m%s\x1b[0m'", "user connected: ", socket.id);
	//var currentuser = socket.handshake.session.username;
	var currentuser = socket.username;
	// console.log(users);
	users[currentuser] = socket.id;	
	io.sockets.emit("update_userCN", currentuser);

	socket.on('disconnect', () => {
		console.log("\x1b[31m", 'user disconnected: ', socket.id);
		usernameDC = getKeyByValue(users, socket.id);
		delete users[usernameDC];
		console.log(users);
		io.sockets.emit("update_userDC", usernameDC);
		// if (attempt === max_socket_reconnects) {
		// 	setTimeout(function(){ socket.socket.reconnect(); }, 5000);
		// 	return console.log("Failed to reconnect. Lets try that again in 5 seconds.");
		//   }
	});
	////////////////////////stacey added stop/////////////////////////////

	// TODO: Change with login user instead of static user
	socket.on('new_user', (user) => {
		socket.username = user;
		console.log('User connected - Username: ' + socket.username + '. Unique ID: ' + socket.id);
	});

	// RECEIVE MESSAGE FROM CLIENT (browser).
	// Seperate CHAT with humans | chat with BOT, if not the same user will get the message twice if both tabs are opened
	socket.on('bot_receive_message', async (msg) => {
		console.log(socket.username + ': ' + msg);
		// TODO: Stacey call your model as an API HERE
		let chatbotresponse = await get_chatbot_response(msg);

		io.emit('bot_send_message', {message: msg, user: socket.username});
		// After that use this to emit (send) message back to client (browser).
		io.emit('bot_send_message', {message: chatbotresponse, user: "Mood+"});
		// End of TODO
	});
	
	socket.on('disconnect', () => {
		console.log('User disconnected - Username: ' + socket.username + '. Unique ID: ' + socket.id);
	});
});
////////////// END OF CHAT/SOCKET.IO - DONT PUT ANY OTHER CODES BELOW UNLESS NECCESSARY ////////////////

// Bring in database connection
const moodplusDB = require('./config/DBConnection');
// Connects to MySQL database
// RESET DB - PUT true
moodplusDB.setUpDB(false); 

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Handle 404 error page - Keep this as a last route
app.use(function (req, res, next) {
	res.status(404);
	res.render('404',  { title: "Page not found" });
});
// No routes below this, otherwise it will get overwritten.

/*
* Creates a unknown port 5000 for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
* */
const port = 5000;

// Starts the server and listen to port 5000
http.listen(port, () => {
	MOTIVATIONAL_PUNS = ['Leggo~ Final push to grad 🥳.', "Stop slacking, I'm watching you 👀.", "The solution is 1 call away."]
	console.log(`${MOTIVATIONAL_PUNS[Math.floor(Math.random() * 3)]} Server started on port http://localhost:${port}`);
});
