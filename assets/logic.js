// instructions

// --When adding trains, administrators should be able to submit the following:
// Train Name
// Destination
// First Train Time -- in military time
// Frequency -- in minutes
// Code this app to calculate when the next train will arrive; this should be relative to the current time.
// Users from many different machines must be able to view same train times.

// -------------------------------------------------------------------------------
$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyCK2C9oFsjYHdg02K0trwXoxWBw-CBsB1E",
    authDomain: "train-schedule-56a2a.firebaseapp.com",
    databaseURL: "https://train-schedule-56a2a.firebaseio.com",
    projectId: "train-schedule-56a2a",
    storageBucket: "train-schedule-56a2a.appspot.com",
    messagingSenderId: "92342298355"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  //-------------MAIN PROCESSES-------------
  //  on click event to sumit
  $("#submit").on("click", function() {
    event.preventDefault();
    // getting input from user
    var trainName = $("#train-name")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var firstTrainTime = $("#first-train-time")
      .val()
      .trim();
    var frequency = $("#frequency")
      .val()
      .trim();

    // creating a temp obj holder for the values
    var newTrain = {
      name: trainName,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrainTime
    };

    // store values from the temp holder to the database
    database.ref().push(newTrain);
    console.log(newTrain);
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.frequency);

    // clear the input boxes
    $("#train-name").val("");
    $("#destination").val(" ");
    $("#first-train-time").val("");
    $("#frequency").val("");

  });

  // creating a fb event. need to tie the data in the fb using the snapshot. this will update any changes

  database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());

    // //
    // function updateInfo(snapshot){
    //    intervalId= setInterval(snapshot,10000);

    // storing the values
    var trainName = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrainTime = snapshot.val().firstTrainTime;
    var time = calcTime(firstTrainTime, frequency);
    console.log(time);

    var newRow = $("<tr>")
      .data("frequency", frequency)
      .data("firstTrainTime", firstTrainTime)
      .append(
        $("<td class='name'>").html(trainName),
        $("<td class='frequency'>").text(frequency),
        $("<td class='destination'>").text(destination),
        $("<td class='next'>").text(time.nextArrival),
        $("<tb class='trainAway'>").text(time.trainAway)
      );

    // CREATING BUTTONS FOR WHEN/IF USER WANTS TO REMOVE ENTRY. NOT WORKING
    //   var delTrainBtn = $('<button>');
    //     console.log('newbutton')
    //     delTrainBtn.addClass('checkbox');
    //     delTrainBtn.attr('data-newRow', newRow);
    //     delTrainBtn.text('X');
    //     delTrainBtn = delTrainBtn.prepend(newRow);
    //     console.log('hi!!!')

    // $('<tbody>').on('click', '.checkbox',function(){
    //   var removeTrainBtn = $(this).attr('data-newRow');
    //   $(newRow + removeTrainBtn).remove();
    // // });
    $("#schedule-table > tbody").append(newRow);
  });

  // SETTING UP A FUNCTION THAT WILL AUTOMATICALLY UPDATE THE TIME.THIS IS WHERE ALL THE TIME CALCULATION IS
  function calcTime(firstTrainTime, frequency) {
    var firstConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log("firstConverted");
    console.log(firstConverted);

    // current time
    var currentTime = moment();
    console.log("hello! current time: " + moment(currentTime).format("HH:MM"));

    // time difference
    var timeDiff = moment().diff(moment(firstConverted), "minutes");
    console.log("difference in time: " + timeDiff);
    console.log(firstTrainTime + "hallo!!");

    // time apart
    var remainder = Math.abs(timeDiff % frequency);
    console.log(remainder);

    // min til train
    var trainAway = frequency - remainder;
    console.log(trainAway);
    console.log("min til train: " + trainAway);

    // NEXT TRAIN ARRIVING
    // var nextArrival = moment().add(trainAway, "minutes");
    var nextArrival = moment().add(trainAway, "minutes");
    console.log("arriving: " + moment(trainAway).format("HH:mm"));

    var time = {
      nextArrival: nextArrival,
      trainAway: trainAway
    };
    return time;
  }
  var interval = setInterval(function() {
    $("tr").each(function() {
      var firstTrainTime = $(this).data("firstTrainTime");
      var frequency = $(this).data("frequency");
      console.log(firstTrainTime, frequency);
      var time = calcTime(firstTrainTime, frequency);
      console.log(time);
      // $(".name").html(trainName),
      // $(".frequency").text(frequency),
      // $(".destination").text(destination),
      $(this)
        .find(".next")
        .text(time.nextArrival),
        $(this)
          .find(".trainAway")
          .text(time.trainAway);
    });
    
  }, 1000);
});
