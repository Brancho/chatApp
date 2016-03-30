var express = require("express");
var app = express();
var fs = require("fs");
var file = require('./public/chat.js').file
var port = 8888;

file.onchange = function(e) {
	fs.readFile(file, function (err, data) {
		 if (err) {
				 return console.error(err);
		 }
		 console.log("Asynchronous read: " + data.toString());
	});
};

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("page");
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'Welcome to the chat :)' });
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});
