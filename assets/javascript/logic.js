// alert("I am working");

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
var nextArrival = "";
var minutesAway = "";

// FUNTIONS
// ==============================================================
// Clear input values
function clearInput() {
    $("#train-name-input").val(" ");
    $("#destination-input").val(" ");
    $("#first-train-input").val(" ");
    $("#frequency-input").val(" ");
}

// METHODS
// ==============================================================
// At load of page and subsequent value changes, display snapshot of value stored in firebase.
database.ref().on("value", function(snapshot) {
        trainName = snapshot.val().trainName;
        console.log(trainName);

        trainRow = $("<tr>");
        trainData = $("<td>");
        destinationData = $("<td>");
        trainData.text(trainName);
        destinationData.text(destination);
        trainRow.append(trainData);
        trainRow.append(destinationData);
        $("tbody").append(trainRow);

});

$("#add-train").on("click", function (event) {

    event.preventDefault();

    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = $("#first-train-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    database.ref().set({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });

    clearInput();

});