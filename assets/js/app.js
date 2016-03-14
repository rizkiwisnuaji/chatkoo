// Defining angular application.
var socketApp = angular.module('socketApp', []);

// Defining Angular controller.
socketApp.controller('ChatController', ['$http', '$log', '$scope', function($http, $log, $scope) {
    $scope.predicate = 'id';
    $scope.reverse = false;
    $scope.baseUrl = 'http://localhost:1337'; // API endpoint
    $scope.chatList = [];

    // This function will call the socket endpoint and fetch all messages.
    $scope.getAllMessages = function() {
        io.socket.get('/chat/');
        $http.get($scope.baseUrl + '/chat/').success(function(success_data) {
            $scope.chatList = success_data;
            // $log.info(success_data);
        });
    };

    // Call above function on load of the page to load previous chats.
    $scope.getAllMessages();
    $scope.chatUser = "Guest"; // Setting default name
    $scope.chatMessage = "";
    // This is the event we generate from our backend system.
    // When user send a message, we broadcast that message in order to display it to user.
    io.socket.on('chat', function(obj) {
        if (obj.verb === 'created') {
            // $log.info(obj);
            $scope.chatList.push(obj.data);
            $scope.$digest();
        }
    });
    // Function that gets called upon click of button.
    $scope.sendMsg = function() {
        // $log.info($scope.chatMessage);
        // Calling the socket API with POST request to add new message in database.
        io.socket.post('/chat/', {
            user: $scope.chatUser,
            message: $scope.chatMessage
        });
        $scope.chatMessage = "";
    };

}]);