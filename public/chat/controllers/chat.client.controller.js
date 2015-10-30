angular.module('chat').controller('ChatController', ['$scope', 'Socket', function($scope, Socket) {
    //created a messages array
	$scope.messages = [];
  
  	//and then implemented the chatMessage event listener that will add retrieved messages to this array.
    Socket.on('chatMessage', function(message) {
      $scope.messages.push(message);
    });
    
	//created a sendMessage() method that will send new messages by emitting the chatMessage event to the socket server.
    $scope.sendMessage = function() {
      var message = {
        text: this.messageText,
      };
      
      Socket.emit('chatMessage', message);
            
      this.messageText = '';
    }
  
  	//used the in-built $destroy event to remove the chatMessage event listener from the socket client.
	//The $destory event will be emitted when the controller instance is deconstructed.
    $scope.$on('$destroy', function() {
      Socket.removeListener('chatMessage');
    })

  }
]);