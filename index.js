const express = require("express");
const app = express();
var rawCenters = require(__dirname + "/getCentersFromAPI.js");
var notifications = require(__dirname + "/sendNotifications.js");
var returnAvailableCenters = require(__dirname + "/returnAvailableCenters.js");

const dataUsers = require("./dataUsers.js");
const centers = require("./API.js");
const axios = require("axios");

app.get("/", (req, res) => {
  // console.log("Hello");
  dataUsers.find((err, users) => {
    if (err) {
      console.log(err);
    } else {
      users.forEach((user) => {
        // var rawCentersArray = rawCenters(user.pincode);
        var rawCentersArray = centers;
        var availableCenters = returnAvailableCenters(
          user.minimumAge,
          rawCentersArray
        );
        if (availableCenters.length > 0) {
          // console.log(createMessage(availableCenters));
          // console.log(availableCenters);
          res.send(availableCenters);
          notifications.sendSMS(user, availableCenters);
          // notifications.sendWhatsappMessage(user, availableCenters);
        }
      });
    }
  });
  // axios
  //   .get(
  //     `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=110001&date=12-05-2021`
  //   )
  //   .then((data) => {
  //     rawCenters = data.data;
  //     res.send(rawCenters);
  //   })
  //   .catch((err) => {
  //     console.log(JSON.stringify(err));
  //   });
});
// function createMessage(xD) {
//   var str = "";
//   xD.forEach((center, index) => {
//     str += `Center number ${index + 1} is Hospital ${
//       center.centerName
//     } located at ${center.centerAddress} and has vaccine available at dates:`;
//     center.sessionsInCenter.forEach((session) => {
//       str += `${session.sessionDate}(Available Capacity:${session.sessionAvailableCapacity} amd vaccine name is ${session.sessionVaccine}), `;
//     });
//     str += " . ";
//   });
//   return str;
// }

app.listen(3000, () => {
  console.log("Started");
  // dataUsers.forEach((user) => {
  //   var OP = returnAvailableCenters(user.minimumAge, user.pincode, centers);
  //   res.send(OP);
  // });
});

// function traceAvailableCapacityForUsers() {
//   dataUsers.forEach((user) => {
//     var centers = rawCenters(user.pincode);
//     var availableCenters = returnAvailableCenters(user.minimumAge, centers);
//     if (availableCenters.length > 0) {
//       notifications.sendSMS(user, availableCenters);
//       notifications.sendWhatsappMessage(user, availableCenters);
//     } else {
//       console.log("Sorry for party Rocking");
//     }
//   });
// }
// setInterval(traceAvailableCapacityForUsers, 4000);

// data
// var dateOP = new Date().getDate();
// var monthOP = new Date().getMonth() + 1;
// var yearOP = new Date().getFullYear();
// var dateFormatted = dateOP + "-" + monthOP + "-" + yearOP;
