var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
	app.route('/signup')
		.get(users.renderSignup)
		.post(users.signup);
	
	app.route('/signin')
		.get(users.renderSignin)
		//This method will try to authenticate the user request using the strategy defined by its first argument. In this case, it will try to authenticate the request using the local strategy. 
		//The second parameter of this method accepts is an options object, which contains three properties:
		//-successRedirect: This property tells Passport where to redirect the request once it successfully authenticated the user
		//-failureRedirect: This property tells Passport where to redirect the request once it failed to authenticate the user
		//-failureFlash: This property tells Passport whether or not to use flash messages
		.post(passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/signin',
		failureFlash: true
		}));
	
	app.get('/signout', users.signout);
	
	//Start the user authentication process
	app.get('/oauth/facebook', passport.authenticate('facebook', {
		failureRedirect: '/signin'
	}));
	
	//Finish the authentication process once the user has linked their Facebook profile
	app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));
	
	//Start the user authentication process
	app.get('/oauth/twitter', passport.authenticate('twitter', {
  		failureRedirect: '/signin'
	}));

	//Finish the authentication process once the user has used their Twitter profile to connect.
	app.get('/oauth/twitter/callback', passport.authenticate('twitter', {
  		failureRedirect: '/signin',
  		successRedirect: '/'
	}));
	
	//Start the user authentication process
	app.get('/oauth/google', passport.authenticate('google', {
  		failureRedirect: '/signin',
  		scope: [
    		'https://www.googleapis.com/auth/userinfo.profile',
    		'https://www.googleapis.com/auth/userinfo.email'
  		],
	}));

	//Finish the authentication process once the user used their Google profile to connect.
	app.get('/oauth/google/callback', passport.authenticate('google', {
  		failureRedirect: '/signin',
  		successRedirect: '/'
	}));
};