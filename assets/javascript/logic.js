// alert("I am working");
// use diff moment.js
// add, subtract, year
$(document).ready(function () {

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
    // Clear input values
    function clearInput() {
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
    }

    // function timer() {
    // Timer to refresh page to show updated train times
    // setTimeout(function () {
    //     location.reload();
    // }, 30000); // 30000 milliseconds means 30 seconds.
    // };

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
        trainName = snapshot.val().trainName.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        destination = snapshot.val().destination.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        firstTrainTime = snapshot.val().firstTrainTime;
        frequency = snapshot.val().frequency;

        // take firstTrainTime in format HH:mm and subtract 1 year to ensure the time comes before the current time.  
        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        // find difference between current time and firstTimeConverted
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // Once we have the difference we need to see how many trains have come and gone and what is left over to then use that number to predict the next arrival. For example, if a train comes every 5 minutes starting at 10:00 and it's 10:11, then we know two trains have come with 1 minute remainder. Knowing the remainer will then give us a point of reference to know in how many minutes the next train will come through simple subtraction of the frequency minus the remainder.
        var tRemainder = diffTime % frequency;
        var minutesTillTrain = frequency - tRemainder;
        var nextTrain = moment(moment().add(minutesTillTrain, "minutes")).format("hh:mm a");

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

        if (minutesTillTrain === 1) {
            var options = {
                'show': true
              }
        
            $('#exampleModal').modal(options)
            $('.modal-body').html("<strong>" + trainName + "</strong> is <em>" + minutesTillTrain + " minute away</em>! <br><br>Please prepare your belongings, and enjoy " + destination + "!<br><br>");
        }

    });

    function addTrain(trainName, destination, firstTrainTime, frequency) {
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

    };

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

        if (trainName && destination && firstTrainTime && frequency) {
            addTrain(trainName, destination, firstTrainTime, frequency);
        } else {
            alert("Please complete entire form");
        };

    });

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // GIPHY API LOGIC

    // QUERY
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=nNJaO7RRux2S8GgjGHR8eQiVlVx79M9r&limit=10";
    console.log("queryURL: " + queryURL);

    // FUNCTIONS
    // =====================================================================
    // ANIMATE GIF
    function animateGif() {

        // ANIMATE LOGIC - When gif is clicked change from still <-> animate
        $(".gif").on("click", function () {
            // Create variable to reference the attribute "data-state" on the object we're clicking
            var state = $(this).attr("data-state");
            console.log(state);
            // Create if/else condition so that the gif knows when to change from still to animate and visa versa. Because the initial source is the still image, we need to first state that...
            // IF the "data-state" is "still" then...
            if (state === "still") {
                // ...change out the "src" of the image to the animated url
                $(this).attr("src", $(this).attr("data-animate"));
                // then, set/update "data-state" to "animate"
                $(this).attr("data-state", "animate");
            } else {
                // if the gif is NOT still then we want to make it still on click of it; change out the src attribute for the still url
                $(this).attr("src", $(this).attr("data-still"));
                // then, set/update "data-state" back to "still"
                $(this).attr("data-state", "still");
            }

        });
    };

    // METHODS
    // =====================================================================
    $("#add-gif-button").on("click", function () {

        $(".gif-display").empty();

        event.preventDefault();

        // Pull value from input and save it to gifInput variable
        var gifInput = $("#gif-topic-input").val().trim();
        console.log(gifInput);

        // Constructing a URL to search Giphy with new input.
        queryURLBase = queryURL + "&q=" + gifInput;
        console.log("queryURLBase: " + queryURLBase);

        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryURLBase,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            // De-reference data in response by storing to variable "results"
            var results = response.data;

            // FOR LOOP ADDING GIFS TO PAGE
            for (var i = 0; i < results.length; i++) {

                // Create div for all giphs and respective information about them (Ratings) to be appended too.
                var $gifDiv = $("<div>");
                $gifDiv.addClass("gif-img-div");
                // Create paragraph html element and place Rating of giph inside
                var $p = $("<p>").text("Rating " + results[i].rating);
                // Create image div
                var $gifIMG = $("<img>");
                // Add "src" attribute to image element and pull url from results placing still image of giphy
                $gifIMG.attr("src", results[i].images.fixed_width_still.url);
                // Add width 100% for styling/layout purposes
                // $gifIMG.attr("style", "width:100%");
                // Add "data-state" attribute to image element called "data-still" so we can reference this later to stop and start giphy
                $gifIMG.attr("data-still", results[i].images.fixed_width_still.url);
                // Add "data-state" attribute to image element called "data-animate" so we can reference this later to stop and start giphy
                $gifIMG.attr("data-animate", results[i].images.fixed_width.url);
                // Add "data-state" attribute called "still" 
                $gifIMG.attr("data-state", "still");
                // Add class to reference later to stop and start giphy
                $gifIMG.addClass("gif");
                // Append div with giphy and paragraph text
                $gifDiv.append($gifIMG);
                $gifDiv.append($p);
                $(".gif-display").append($gifDiv);
            };

            animateGif();

        });

    });

});