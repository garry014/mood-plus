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



/*
* Loads routes file main.js in routes directory. The main.js determines which function
* will be called based on the HTTP request and URL.
*/
const mainRoute = require('./routes/main');
const forumRoute = require('./routes/forum'); // Add this line
const chatRoute = require('./routes/chat');

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
app.use(session({
	key: 'vidjot_session',
	secret: 'tojiv',
	resave: false,
	saveUninitialized: false,
}));

app.use(flash());
app.use(FlashMessenger.middleware); // add this statement after flash()


// Place to define global variables - not used in practical 1
app.use(function (req, res, next) {
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

// Create socket instance
const io = require('socket.io')(http);
var users = [];

////////////////////////////// CHAT/SOCKET.IO KJ & STACEY ////////////////////////////////////
// io.use(sharedsession(session));
// add listener for new connection
io.eio.pingTimeout = 60000;
io.on("connection", async function(socket){
	console.log("user connected: ", ) //"'\x1b[36m%s\x1b[0m'",;

	// TODO: Change with login user instead of static user
	socket.on('new_user', (user) => {
		socket.username = user;
		console.log('User connected - Username: ' + socket.username + '. Unique ID: ' + socket.id);
	});

	// RECEIVE MESSAGE FROM CLIENT (browser).
	// Seperate CHAT with humans | chat with BOT, if not the same user will get the message twice if both tabs are opened
	socket.on('bot_receive_message', (msg) => {
		console.log(socket.username + ': ' + msg);
		// TODO: Stacey call your model as an API HERE
		
		io.emit('bot_send_message', {message: msg, user: socket.username});
		// After that use this to emit (send) message back to client (browser).
		io.emit('bot_send_message', {message: "You need to poop more often to get better mental health.", user: "bot"});
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