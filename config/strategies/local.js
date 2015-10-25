
//Requires the Passport module, the local strategy module's Strategy object, and your User Mongoose model.
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
	//LocalStrategy constructor takes a callback function as an argument. It will later call this callback when trying to authenticate a user
	passport.use(new LocalStrategy(function(username, password, done) {
		//The callback function accepts three arguments—username, password, and a done callback—which will be called when the authentication process is over. Inside the callback function, you will use the User Mongoose model to find a user with that username and try to authenticate it. In the event of an error, you will pass the error object to the done callback. When the user is authenticated, you will call the done callback with the user Mongoose object.
		User.findOne({
    	username: username
    	}, function(err, user) {
      		if (err) {
        		return done(err);
      		}
      
			if (!user) {
        		return done(null, false, {
					message: 'Unknown user'
        		});
      		}
      		if (!user.authenticate(password)) {
        		return done(null, false, {
          			message: 'Invalid password'
        		});
      		}
	  		return done(null, user);
	  });
  }));
};