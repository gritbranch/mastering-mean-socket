//First, you used the io.emit() method to inform all the connected socket clients about the newly connected user. 
//This was done by emitting the chatMessage event, and passing a chat message object with the user information and the message text, time, and type. 
//Since you took care of handling the user authentication in your socket server configuration, the user information is available from the socket.request.user object
module.exports = function(io, socket) {
  io.emit('chatMessage', {
    type: 'status',
    text: 'connected',
    created: Date.now(),
    username: socket.request.user.username
  });

//Next, you implemented the chatMessage event handler that will take care of messages sent from the socket client. 
//The event handler will add the message type, time, and user information, and it will send the modified message object to all connected socket clients using the io.emit() method.
  socket.on('chatMessage', function(message) {
    message.type = 'message';
    message.created = Date.now();
    message.username = socket.request.user.username;

    io.emit('chatMessage', message);
  });

//Our last event handler will take care of handling the disconnect system event. 
//When a certain user is disconnected from the server, the event handler will notify all the connected socket clients about this event by using the io.emit() method. 
//This will allow the chat view to present the disconnection information to other users.
  socket.on('disconnect', function() {
    io.emit('chatMessage', {
    type: 'status',
    text: 'disconnected',
    created: Date.now(),
    username: socket.request.user.username
    });
  });
};