// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyCaPNG8IplOzJMPSyYajmJUyUELF7QdXGY",
  authDomain: "trainsched-6474d.firebaseapp.com",
  databaseURL: "https://trainsched-6474d.firebaseio.com",
  projectId: "trainsched-6474d",
  storageBucket: "trainsched-6474d.appspot.com",
  messagingSenderId: "851770500088"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#dest-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
  var trainFreq = $("#freq-input").val().trim();

console.log(trainName, trainDest, trainStart, trainFreq);

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    freq: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.start);
  console.log(newTrain.freq);

  // Alert
  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;

  // train Info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainStart);
  console.log(trainFreq);

  var trainStartConverted = moment(trainStart,"HH:mm").subtract(1, "years");

  // Calculate the minutes away
  var now = moment()
  var minutesAway = trainFreq - ((now.diff(trainStartConverted, "minutes")) % trainFreq)
  console.log(minutesAway);

  // Prettify the train start
  var trainNextArrival = moment().add(minutesAway, "minutes").format("HH:mm");


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainFreq + "</td><td>" + trainNextArrival + "</td><td>" +  minutesAway + "</td></tr>");
});
