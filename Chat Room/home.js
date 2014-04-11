$(document).ready(function(){

	
  	

	$("#newChatroom").bind('click', function(){
		
		var request = new XMLHttpRequest();
		request.open('GET', '/newChat', true); //change to get
		request.addEventListener('load', function(e){
			if (request.status == 200) {
				window.location.href = '/' + request.responseText;
			}
		}); 
		request.send();
	});


	var request = new XMLHttpRequest();
	request.open('GET', '/list', true);
	request.addEventListener('load', function(e){
		if (request.status == 200) {
			var rooms = JSON.parse(request.responseText);
			if (rooms.length > 0) {
				var htmlString = $("aList").html();
				$('#aList').text("Here's a list of the current chatrooms");
			}
			for(var i = 0; i < rooms.length; i++) {
				$('#chatRoomList').append("<li><a href = '" + 
					rooms[i].chatroomName + "'>" + 
					rooms[i].chatroomName + "</a></li>");
			}
		}
	});
	request.send();
});