const express = require("express");
const app = express();
const axios = require("axios");
var notifications = require(__dirname + "/sendNotifications.js");

const dataUsers = require("./dataUsers.js");
const centers = require("./API.js");
var metaData = [];
var metaDataOP = [];

app.get("/", (req, res) => {
  console.log("Hello");
  res.send(findCenters(10, "411007"));
});

app.listen(3000, () => {
  console.log("Started");
  dataUsers.forEach((user) => {
    // notifications.sendSMS(user, "OP OP");
    // notifications.sendWhatsappMessage(user, "OP OP");
  });
});

function findCenters(number, pinCode) {
  centers.forEach((center) => {
    var intermediate = {
      centerName: center.name,
      centerAddress: center.address,
      sessionVaccineFee: center.fee_type,
      sessionsInCenter: [],
    };
    center.sessions.forEach((session, currentSessionIndex) => {
      if (session.min_age_limit == 45 && session.available_capacity > 0) {
        var sessionInCenter = {
          sessionAvailableCapacity: session.available_capacity,
          sessionDate: session.date,
          sessionVaccine: session.vaccine,
        };
        intermediate.sessionsInCenter.push(sessionInCenter);
        //   if(center.sessions.length-1==currentSessionIndex){
        //       metaData.push(intermediate)
        //   }
      }
    });
    metaData.push(intermediate);
  });
  metaDataOP = dataRedundancySolver(metaData);
  return metaDataOP;
}
function dataRedundancySolver(m) {
  var hehe = m.filter((center) => {
    if (center.sessionsInCenter.length > 0) {
      return center;
    }
  });
  return hehe;
}
// function traceAvailableCapacityForUsers() {
//     dataUsers.forEach((user) => {
//         var availableCenters=findCenters(user.number,user.pinCode);
//         if(availableCenters.length>0){
//             // SendSMS
//         }
//     });
// }
// setInterval(traceAvailableCapacityForUsers, 4000);

// data
var dateOP = new Date().getDate();
var monthOP = new Date().getMonth() + 1;
var yearOP = new Date().getFullYear();
var dateFormatted = dateOP + "-" + monthOP + "-" + yearOP;
