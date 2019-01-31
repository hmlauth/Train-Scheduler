// alert("I am working");
// use diff moment.js
// add, subtract, year

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
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
}

// METHODS
// ==============================================================
// At load of page and subsequent value changes, display snapshot of value stored in firebase.
// Ref takes in particular path to update inside of our database. A place to store data in our database. 
// "child_added" is an event and the "function(snapshot)" is a call back function b/c it is listed as the second parameter.
// child_added will give you all the data added at once
// set will overwrite the reference that you're dealing with, versus push will add to the reference that you're dealing with.
// push and child_added are connected - make sure you're ref the same location in database
database.ref().on("child_added", function (snapshot) {
    // snapshot.val() grabs "thing" that was saved to database; just snapshot will provide metadata about the "thing" we care about.
    // snapshot gives things in the order that they were added to the database unless otherwise specified. 
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrainTime = snapshot.val().firstTrainTime;
    frequency = snapshot.val().frequency;

        // take firstTrainTime in format HH:mm and subtract 1 year to ensure the time comes before the current time.  
        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        // find difference between current time and firstTimeConverted
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log(diffTime);
        // Once we have the difference we need to see how many trains have come and gone and what is left over to then use that number to predict the next arrival. For example, if a train comes every 5 minutes starting at 10:00 and it's 10:11, then we know two trains have come with 1 minute remainder. Knowing the remainer will then give us a point of reference to know in how many minutes the next train will come through simple subtraction of the frequency minus the remainder.
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);
        var minutesTillTrain = frequency - tRemainder;
        console.log(minutesTillTrain);
        var nextTrain = moment(moment().add(minutesTillTrain, "minutes")).format("hh:mm");
        console.log(nextTrain);

    // Create new table elements
    tRow = $("<tr>");
    tTrain = $("<td>");
    tDestination = $("<td>");
    tFrequency = $("<td>");
    tNextArrival = $("<td>");
    tMinutesTillTrain = $("<td>");

    // Put text in each element
    tTrain.text(trainName);
    tDestination.text(destination);
    tFrequency.text("Every " + frequency + " min.");
    tNextArrival.text(nextTrain);
    tMinutesTillTrain.text(minutesTillTrain + " min. away!");
    // Append child_added snapshot data to the new row
    tRow.append(tTrain);
    tRow.append(tDestination);
    tRow.append(tFrequency);
    tRow.append(tNextArrival);
    tRow.append(tMinutesTillTrain);
    // Append new row to the tbody
    $("tbody").append(tRow);

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

    // Instead of set(), use push() which adds data to the root
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
        // Next Arrival and Minutes Away will be calculated after we pull the snapshot of the added information and then display in on the page. 
    }, function (error) {
        if (error) {
            // The write failed...
        } else {
            // Data saved successfully!
        }
    });

    clearInput();

});