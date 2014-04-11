
$(document).ready(function(){
	
	var currentURL = window.location.pathname;
	var roomName = currentURL.split('/')[1];

	var htmlString = $("#roomId").html();
  	$('#roomId').text('Welcome to chat room ' + roomName + '!');

	$("#messageForm").submit(send);
	$("meesageField").keypress(function (e) {
		if(e.keycode == 13) {
			sendMessage(e);

		}
	});

	function send(e) {

		e.preventDefault(); 
		var form = new FormData(document.getElementById('messageForm'));
		form.append('name', roomName);
		//form.append('nickname', $('#nicknameField').val());
		//form.append('message', $('#messageField').val());
		form.append('time', (new Date).getTime());
		

		//send request 
		var request = new XMLHttpRequest();
		request.open('POST', '/' + roomName + '/sendMessage', true);
		request.send(form);


		//reset text
		$('#messageField').val("");
	}

	var existingMessages = {};

	setInterval(function() {
		var request = new XMLHttpRequest();
		request.open('GET', '/' + roomName + '/getMessages', true);
		request.addEventListener('load', function () {
			if(request.status == 200) {
				var messagesJSON = JSON.parse(request.responseText);
				var post = $("#currentMessages");
				for(var i = 0; i < messagesJSON.length; i++) {
					function isOdd(num) { return num % 2;}
					if(isOdd(i)) {
					if(!(existingMessages.hasOwnProperty(messagesJSON[i].id))) {
						post.append('<li id="style1">' + messagesJSON[i].nickname + ": " + messagesJSON[i].body + '</li>');
						existingMessages[messagesJSON[i].id] = "stored";

					}
				}
					//new color
				else if(!(existingMessages.hasOwnProperty(messagesJSON[i].id))) {
					post.append('<li id="style2">' + messagesJSON[i].nickname + ": " + messagesJSON[i].body + '</li>');
					existingMessages[messagesJSON[i].id] = "stored";

					}

				}
			}

		});
		request.send();
	}, 200);

});