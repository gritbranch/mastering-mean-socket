var config = require('./config'),					//requires config.js
	http = require('http'),							//registers http object
    socketio = require('socket.io'),				//registers socket.io object
	express = require('express'),					
  	morgan = require('morgan'),						//morgan module provides a simple logger middleware
  	compress = require('compression'),				//compression module will provides response compression
  	bodyParser = require('body-parser'),			//body-parser module provides several middleware to handle request data
  	methodOverride = require('method-override'),	//method-override module provides DELETE and PUT HTTP verbs legacy support
  	session = require('express-session'),			//express-session module will use a cookie-stored, signed identifier to identify the current user
	MongoStore = require('connect-mongo')(session), //registers connet-mongo instance and then passed the Express session module.
  	flash = require('connect-flash'),				//registers flash module to the application
	passport = require('passport');					//registers passport middleware to the application

//Used the CommonJS module pattern to define a module function that initializes the Express application.
module.exports = function(db) {
	//Created the first instance of Expres application.
	var app = express();
	var server = http.createServer(app);			//uses the http core module to create a server object that wraps your Express app object
    var io = socketio.listen(server);				//uses the socket.io module and its listen() method to attach the Socket.io server with your server object.

	//determine our environment and configure the Express application accordingly
	if (process.env.NODE_ENV === 'development') {
		//loads morgan() middleware in a development environment
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		//loads compress() middleware in a production environment
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	

	app.use(bodyParser.json());
	app.use(methodOverride());

	//Creates a new connect-mongo instance and passed it your Mongoose connection object. 
  	var mongoStore = new MongoStore({
    	db: db.connection.db
  	});

	//session middleware adds a session object to all request objects in your application
	app.use(session({
    	saveUninitialized: true,
    	resave: true,
    	secret: config.sessionSecret,
    	store: mongoStore //Uses the Express session store option to let the Express session module know where to store the session information.
  	}));

	//app.set() method to configure the Express application views folder and template engine
  	app.set('views', './app/views');
  	app.set('view engine', 'ejs');

	app.use(flash());				//creates a new flash application in the session
 	app.use(passport.initialize()); //bootstraps the passport module
 	app.use(passport.session());	//uses express session to keep track of user's session

	require('../app/routes/index.server.routes.js')(app); //Requires the routing index and executes it passing the app as paramater.
	require('../app/routes/users.server.routes.js')(app); //Requires the routing users and executes it passing the app as paramater.
	require('../app/routes/articles.server.routes.js')(app); //Requires the routing articles and executes it passing the app as paramater.
	
	//loads express.static() to serve static files. This middleware takes one argument to determine the location of the static folder
	app.use(express.static('./public'));

	//execute your Socket.io configuration method and will take care of setting the Socket.io session.
	require('./socketio')(server, io, mongoStore);

	return server; //Returns server object instead of Express application object (app). When server starts, it will run Socket.io along with Express application.
};