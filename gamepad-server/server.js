var http = require('http');
var express = require('express');

// Create Express webapp
var app = express();
app.use(express.static('public'));

// Set up HTTP Server
var server = http.createServer(app);

// Mount socket.io on the HTTP server
var io = require('socket.io')(server);

var activeClients = 0;

// Handle coket connections
io.on('connection', function(socket) {
    activeClients++;
    console.log("Socket connection, # active clients -> "+activeClients)
    socket.on('disconnect', function(){
      activeClients--;
      console.log("Socket disconnected ! # active clients -> "+activeClients)
    });
    socket.on('input', function(gamepad) {
      io.emit('gamepad', gamepad)
    });
});

// Start HTTP Server
server.listen(3000, function() {
    console.log('Express server running on port 3000');
});
