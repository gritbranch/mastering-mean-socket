//Required the necessary dependencies, and then you used the io.use() configuration method to intercept the handshake //process. In your configuration function, you used the Express cookie-parser module to parse the handshake request //cookie and retrieve the Express sessionId. Then, you used the //connect-mongo instance to retrieve the session //information from the MongoDB storage. Once you retrieved the session object, you used the passport.initialize() and //passport.session() middleware to populate the session's user object according to the session information. If a user //is authenticated, //the handshake middleware will call the next() callback and continue with the socket //initialization; otherwise, it will use the next() callback in a way that informs Socket.io that a socket connection //cannot be opened. This means that only authenticated users can open a socket communication with //the server and //prevent unauthorized connections to your Socket.io server.
var config = require('./config'),
  cookieParser = require('cookie-parser'),
  passport = require('passport');

module.exports = function(server, io, mongoStore) {
  io.use(function(socket, next) {
    cookieParser(config.sessionSecret)(socket.request, {}, function(err) {
      var sessionId = socket.request.signedCookies['connect.sid'];

      mongoStore.get(sessionId, function(err, session) {
        socket.request.session = session;

        passport.initialize()(socket.request, {}, function() {
          passport.session()(socket.request, {}, function() {
            if (socket.request.user) {
              next(null, true);
            } else {
              next(new Error('User is not authenticated'), false);
            }
          })
        });
      });
    });
  });

  io.on('connection', function(socket) {
    require('../app/controllers/chat.server.controller')(io, socket);
  });
};