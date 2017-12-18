//Initialize Database
var config = {
    apiKey: "AIzaSyC-gZgN0pVkZrikTj2t8-coL7l8HtwqxsU",
    authDomain: "classproject-d6e68.firebaseapp.com",
    databaseURL: "https://classproject-d6e68.firebaseio.com",
    projectId: "classproject-d6e68",
    storageBucket: "classproject-d6e68.appspot.com",
    messagingSenderId: "769292531793"
  };

firebase.initializeApp(config);

var database = firebase.database();