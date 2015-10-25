var passport = require('passport'),
    url = require('url'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../config'),
    users = require('../../app/controllers/users.server.controller');

//Accepts five arguments: the HTTP request object, an accessToken object to validate future requests, a refreshToken object to grab new access tokens, a profile object containing the user profile, and a done callback to be called when the authentication process is over.
module.exports = function() {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    //TO DO: No values for profile.x fields
    var providerUserProfile = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      fullName: profile.displayName,
      //email: profile.emails[0].value,
      email: 'ryansalvador@gmail.com',
      username: profile.username,
      provider: 'facebook',
      providerId: profile.id,
      providerData: providerData
    };

	  //Authenticates the current user
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};