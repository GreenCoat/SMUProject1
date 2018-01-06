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
var connection;

//Wait for document to load
$(document).ready(function(){
	//Displays the default user name
	$("#current-user").text(user);

	//Change username based on input field
	$("#login").on("click", function(){
		//Keep button from refreshing the page
		event.preventDefault();

		//Get new name from input field
		var newName = $("#username").val().trim();

		//Validation, currently checking if name is blank
		if(newName != ""){
			//sets new user name
			setUser(newName);
		}
	
		//Clear out login field
		$("#username").val("");
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
				user: user,
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

		var p = '<div class="container"><span>'
				+sv.user+'</span><p>'
				+sv.message+'</p><span class="time-right"></span></div>'

		document.createElement("p")
		p.innerHTML = sv.message
		$("#chat-window").append(p)

		// Puts chat message in chat window
		// $("#chat-window").append("<div>"+sv.user+": "+sv.message+"</div>");


	});


	//Pushes connection to DB
	database.ref(".info/connected").on("value", function(snapshot){
		if(snapshot.val()){
			//Adds user when they connect
			connection = database.ref("/connections").push({user: user});
			
			//Removes user when they disconnet
			connection.onDisconnect().remove();
		}
	});

	//Updates connection info
	database.ref("/connections").on("value", function(snapshot){
		//Save data to variable
		var sv = snapshot;

		//Clear User List
		$("#user-list").html("");

		//Loop over connections and rewrite list
		sv.forEach(function(child){
			$("#user-list").append("<div>"+child.val().user+"</div>");
		});
	});

	//Function for changing user
	function setUser(name){
		//Update global variable
		user = name;

		//Set display element
		$("#current-user").text(user);

		//Updates reference in the DB
		database.ref("/connections/"+connection.key).update({user: user});
	}
});