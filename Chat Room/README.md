README
======
This is my chatroom. Yes, the design is intentionally terrible / web-90's. 

It was built using SQL, Node, and Javascript/jQuery.

Everytime the button to make a new chatroom is called, the random ID generator creates a new path on the host 
to the chat room, and then when a message and name is called, a database is created the keeps track of
name of the room, name of the user, message, and time. The database is then constantly being querried for
messages to display. 

Run "node chatServer.js" and visit local:8080 to use. 

