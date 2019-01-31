// instructions

// --When adding trains, administrators should be able to submit the following:
// Train Name
// Destination 
// First Train Time -- in military time
// Frequency -- in minutes
// Code this app to calculate when the next train will arrive; this should be relative to the current time.
// Users from many different machines must be able to view same train times.

// -------------------------------------------------------------------------------

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

//   first train is at 6am. train leaves every 5 mins. 
// current time is 6:08am
// next train is?
// 08-00=8(current time - when train leaves)
// 8%5 = 3 ()
// 5 - 3 = 2 min away (train leaving every 5 min - the current waiting time 3)
// 2 min + 6:08 current time = 6:10 ( when the next train will arrive)
   



// ---------------------TIME STUFF

var frequency = 5;
var firstTrainTime = '06:00';
var trainLeaves = firstTrainTime + frequency;

// DIFF BETWEEN THE TIMES
var firstConverted = moment(firstTrainTime, 'HH:mm' ).subtract(1,'years');
console.log(firstConverted);
var timeDiff = moment().diff(moment(firstConverted), 'minutes');

var currentTime = moment();
console.log('hello! current time: '+ moment(currentTime).format('HH:MM')); 

// TIME APART
var remainder =  timeDiff % frequency;
// (currentTime - trainLeaves) % frequency;
console.log(remainder)

// min til train
var trainAway = frequency - remainder;
console.log('min til train: ' + trainAway);

// NEXT TRAIN ARRIVING
var nextArrivaL = moment().add(trainAway + currentTime,'minutes');
console.log('arriving: ' + moment(trainAway).format('HH:mm'));


//-------------MAIN PROCESSES-------------
//  on click event to sumit
$('#submit').on('click', function(){ 

    event.preventDefault();
    // getting input from user
    var trainName = $('#train-name').val().trim();
    var destination = $('#destination').val().trim();
    var firstTrain = $('#first-train-time').val().trim();
    var frequency= $('#frequency').val().trim();

    // creating a temp holder for the values
    var newTrain = {
        name: trainName,
        destination:destination,
        frequency:frequency
    };
    // store values from the temp holder to the database
    database.ref().push(newTrain);
        console.log(newTrain);
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.frequency);

    // clear the input boxes
    $('#train-name').val('');
    $('#destination').val(" ");
    $('#first-train-time').val('');
    $('#frequency').val('');
});

// creating a fb event. need to tie the data in the fb to our side using the snapshot. this will update any changes 

database.ref().on('child_added', function(snapshot){
    console.log(snapshot.val());
    
    // storing the values 
    var trainName = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;

    console.log(trainName)
    console.log(destination)
    console.log(frequency)

    var newRow = $('<tr>').append(
    $('<td>').html(trainName),
    $('<td>').text(destination),
    $('<td>').text(frequency),
    $('<td>').text(nextArrivaL),
    $('<tb>').text(trainAway)


    );

    $('#schedule-table > tbody').append(newRow);
});

// store info to the database