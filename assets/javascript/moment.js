alert("I am working");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDKFkzSHbWlIyDiQ66WgYzmx-KnCosZAsE",
    authDomain: "train-scheduler-8782c.firebaseapp.com",
    databaseURL: "https://train-scheduler-8782c.firebaseio.com",
    projectId: "train-scheduler-8782c",
    storageBucket: "train-scheduler-8782c.appspot.com",
    messagingSenderId: "5554274040"
};
firebase.initializeApp(config);

// SET UP VARIABLES
// ==============================================================
// create variable to reference firebase database
var database = firebase.database();

// initial values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";

// FUNTIONS
// ==============================================================

// METHODS
// ==============================================================
$("#add-train").on("click", function(event) {

    event.preventDefault();

    trainName = $("#train-name-input").val().trim();
    console.log(trainName);

    database.ref().set({
        trainName: trainName
    });

});





