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

//Array of valid filetypes for images
var fileTypes = ["jpg", "png", "gif"];

//Wait for document to load
$(document).ready(function(){
	setCookie("user", user, 365);
	var test = getCookie("user");
	console.log(test);

	//Displays the default user name
	$("#current-user").text(user);

	//Change username based on input field
	$("#login").on("click", function(event){
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

	//On click button for searching for content
	$("#search-submit").on('click', function(event){
		//Keep button from refreshing the page
		event.preventDefault();


		//Get input from search
		var search = $("#search").val().trim();

		//AJAX call to retrieve data
		var xhr = $.get("http://api.giphy.com/v1/gifs/search?q="+search+"&api_key=USa3C1wTZmYVJZpCU9yItXceOqvm8h2w&limit=5");
		xhr.done(function(data) { 
			//Put data in a variable
			var dataArray = data.data;
			var image;
			var original;

			//Loop over data and return images
			for (var i = 0; i < dataArray.length; i++) {
				
				image = dataArray[i].images.fixed_width_small_still.url;
				original = dataArray[i].images.original.url

				$("#search-result").append("<button class='img-source'><img src='"+image+"' alt='some image' data-value='"+original+"'></button>");
			}

			//Create listeners to handle sending content to stage
			$(document).on("click", ".img-source", function(event){
				var value = event.target.dataset.value;

				displayImage(value);
			});
 		});


		
	});

	//On click button for adding something to the stage
	$("#stage-submit").on("click", function(event){
		//Keep button from refreshing the page
		event.preventDefault();

		//Get input from field
		var item = $("#stage-input").val().trim();

		//Validate input to make sure its an image or similar
		//Split string to get filetype
		var a = item.split(".");
	
		//Get filetype
		var type = a[a.length-1];
	
		//Verify filetype
		for(var i = 0; i < fileTypes.length; i++){
			if(type == fileTypes[i]){
				displayImage(item);
			}
		}
	});

	//On click button for saving chat messages to DB
	$("#send").on("click", function(event){
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

	database.ref("/stage").on("value", function(snapshot){
		//Retrieves data snapshot
		var sv = snapshot.val();

		//If stage isn't null, display it
		if(sv != null){
			$("#main-stage").html("<img src='"+sv.stage+"' alt='some image'>");
		}
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

	function displayImage(item){
		//Pass image to database
		database.ref("/stage").set({stage: item});
	}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}







});
