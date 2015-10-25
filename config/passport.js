var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function() {
	var User = mongoose.model('User');
	
	//When a user is authenticated, Passport will save its _id property to the session. Later on when the user object is needed, 
	//Passport will use the _id property to grab the user object from the database.
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
	User.findOne({
		_id: id
	}, '-password -salt', function(err, user) {
		done(err, user);
	});
	});
	
	require('./strategies/local.js')();
	require('./strategies/facebook.js')();
	require('./strategies/twitter.js')();
	require('./strategies/google.js')();
};