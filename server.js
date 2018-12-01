var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	usernames = [];

server.listen(process.env.PORT || 3000);
console.log('Server Running...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	console.log('Socket Connected...');

	socket.on('new user', function(data, callback){
		if(usernames.indexOf(data) != -1){
			callback(false);
		} else {
			console.log("new user server"+Date.now())
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
			
		}
	});

	// Update Usernames
	function updateUsernames(){
		io.sockets.emit('usernames', usernames);
		console.log("update usernames server"+Date.now())
	}

	// Send Message
	socket.on('send message', function(data){
		//console.log("this is data"+data)
		console.log("send message"+Date.now())
		io.sockets.emit('new message', {msg: data, user:socket.username});
		console.log("new message server"+Date.now())
	});

	// Disconnect
	socket.on('disconnect', function(data){
		if(!socket.username){
			return;
		}
          // console.log(socket.username)
		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	});
});