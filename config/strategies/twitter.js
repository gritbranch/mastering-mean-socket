var passport = require('passport'),
    url = require('url'),
    TwitterStrategy = require('passport-twitter').Strategy,
    config = require('../config'),
    users = require('../../app/controllers/users.server.controller');

//TwitterStrategy constructor takes two arguments: the Twitter application information and a callback function that it will call later when trying to authenticate a user
//Accepts five arguments: the HTTP request object, a token object and a tokenSecret object to validate future requests, a profile object containing the user profile, and a done callback to be called when the authentication process is over.
module.exports = function() {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    var providerData = profile._json;
    providerData.token = token;
    providerData.tokenSecret = tokenSecret;

    var providerUserProfile = {
      fullName: profile.displayName,
      username: profile.username,
      provider: 'twitter',
      providerId: profile.id,
      providerData: providerData
    };

	  //Authenticates the current user
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};