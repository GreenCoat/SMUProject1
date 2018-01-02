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

//Default user variable TODO: Pulls information from a cookie to remember user login
var user = 'Guest';

//Wait for document to load
$(document).ready(function(){
	//Sets the default user name
	setUser(user);

	//Change username based on input field
	$("#user-login").on("click", function(){
		//Keep button from refreshing the page
		event.preventDefault();

		//Get new name from input field
		var newName = $("#user-login").val().trim();

		//Validation, currently checking if name is blank
		if(newName != ""){
			//sets new user name
			setUser(newName);
		}
	
		//Clear out login field
		$("#user-login").val("");
	});

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

	//Function for changing user
	function setUser(name){
		//Update global variable
		user = name;

		//Set display element
		$("#current-user").text(user);
	}
});