$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyDCw0Ohwcf-oOuuZmWhu75d5Jt1RWxrAIk",
        authDomain: "train-scheduler-21830.firebaseapp.com",
        databaseURL: "https://train-scheduler-21830.firebaseio.com",
        projectId: "train-scheduler-21830",
        storageBucket: "",
        messagingSenderId: "991141841382"
    };
    firebase.initializeApp(config);

    const db = firebase.database();
    const trainSchedule = db.ref('trains/');

    function addTrain(trainId, name, destination, frequency, firstTime) {
        db.ref('trains/' + trainId).set({
            name: name,
            destination: destination,
            frequency: frequency,
            firstTime: firstTime
        });
    };

    $("#add-train").on("click", function (event) {
        event.preventDefault();

        let newId = db.ref().child('trains').push().key;
        let name = $("#name-input").val().trim();
        let destination = $("#destination-input").val().trim();
        let frequency = $("#frequency-input").val().trim();
        let firstTime = moment($("#time-input").val().trim(), "HH:mm").format("HH:mm");

        addTrain(newId, name, destination, frequency, firstTime);

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#frequency-input").val("");
        $("#time-input").val("");
    });

    trainSchedule.on('value', function (snapshot) {
        let trains = snapshot.val();
        $(".train").remove();

        for (key in trains) {

            var tFrequency = trains[key].frequency;
            var firstTime = trains[key].firstTime;
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            var tRemainder = diffTime % tFrequency;
            var tMinutesTillTrain = tFrequency - tRemainder;
            var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");

            let row = $("<div>").addClass("row train").attr("id", key);
            let colName = $("<div>").addClass("col-sm train").attr("id", "name-" + key).text(trains[key].name);
            let colDestination = $("<div>").addClass("col-sm train").attr("id", "destination-" + key).text(trains[key].destination);
            let colFrequency = $("<div>").addClass("col-sm train").attr("id", "name-" + key).text(trains[key].frequency);
            let colNextArrival = $("<div>").addClass("col-sm train").attr("id", "arrival-" + key).text(nextTrain);
            let colMinAway = $("<div>").addClass("col-sm train").attr("id", "minAway-" + key).text(tMinutesTillTrain);

            row.append(colName, colDestination, colFrequency, colNextArrival, colMinAway)
            $("#new-trains").append(row, `<hr class="train">`)
        };
    });

});