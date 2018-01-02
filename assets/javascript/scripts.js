//Initialize Database
var config = {
    apiKey: "AIzaSyBSr-0kuZwXxHJgFYWeQIf3pn2alAAD3cQ",
    authDomain: "myfirstproject-b539b.firebaseapp.com",
    databaseURL: "https://myfirstproject-b539b.firebaseio.com",
    projectId: "myfirstproject-b539b",
    storageBucket: "myfirstproject-b539b.appspot.com",
    messagingSenderId: "51096609060"
  };

firebase.initializeApp(config);

var database = firebase.database();

//Wait for document to load
$(document).ready(function(){

	//On click button for saving chat messages to DB
	$("#send").on("click", function(){
		//Keep submit button from refreshing the page
		event.preventDefault();

		//Get message from message field
		var message = $("#chat-message").val().trim();

		//Validation, currently checking if message is empty
		if(message != ""){
			database.ref("/messages").push({
				message: message
			});
		}
	
		//Clear out message field
		$("#chat-message").val("");
	});


	//Update event for DB that also retrieves messages
	database.ref("/messages").on("child_added", function(snapshot){
		//Retrieves data snapshot
		var sv = snapshot.val();

		//Puts chat message in chat window
		$("#chat-window").append("<div>"+sv.message+"</div>");
	});
});