
var http = require('http');
var express = require('express');
var anyDB = require('any-db');
var fs = require('fs');
var conn = anyDB.createConnection('sqlite3://chatroom.db');
var app = express();

conn.query('CREATE TABLE IF NOT EXISTS chatrooms (chatroomName TEXT)')
	.on('end', function(){
		console.log('Made table!');
		conn.end();
	});

conn.query('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, nickname TEXT, body TEXT, time INTEGER)')
	.on('end', function(){
		console.log('Made table!');
		conn.end();
	});


app.use(express.bodyParser()); // definitely use this feature

app.configure(function() {
	app.use(express.static(__dirname));
});

//Send homepage
app.get('/' , function(request, response){
	response.sendfile(__dirname + '/home.html');

	});

//listchat rooms
app.get('/list', function(request, response) {
	var roomnames = conn.query('SELECT * FROM chatrooms', function(err, result){
		if(err) {
			console.log(err);
			response.end();
		}
		response.json(result.rows);
		response.end();
	});
});

//generate room identifier
function generateRoomIdentifier() {
    // make a list of legal characters
    // we're intentionally excluding 0, O, I, and 1 for readability
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    var result = '';
    for (var i = 0; i < 6; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));

    return result;
}

//make new chatroom
app.get('/newChat', function(request, response) {
	var newChat = generateRoomIdentifier(); //$1 might need parens
	conn.query("INSERT INTO chatrooms VALUES ($1)", [newChat])
	.on('error', console.error);
	response.send(newChat);
});

//visit chatroom
app.get('/:roomName', function(request, response) {
 	response.sendfile(__dirname +'/chatroom.html');
});

//send a message
app.post('/:roomName/sendMessage', function(request, response){
    conn.query('INSERT INTO messages (room, nickname, body, time) VALUES ($1, $2, $3, $4)', 
    	[request.params.roomName, request.body.nickname, request.body.message,
    	request.body.time]);
    console.log(request.body.message);
    console.log(request.body);
    response.end();
});


//get chatroom updates
app.get('/:roomName/getMessages', function(request, response){
	conn.query('SELECT * FROM messages WHERE room = ($1)', [request.params.roomName], 
		function(err, result){
			if(err) {
				console.log(err);
				response.end();
			}
			response.json(result.rows);

		});
});

//
app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});

