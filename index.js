const express = require("express");
const app = express();
var rawCenters = require(__dirname + "/getCentersFromAPI.js");
var notifications = require(__dirname + "/sendNotifications.js");
var returnAvailableCenters = require(__dirname + "/returnAvailableCenters.js");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

const dataUsers = require("./dataUsers.js");
// for testing purpose you can use file API.js for getting unfiltered vaccine centers
// const rawCentersForTesting = require("./API.js");
const axios = require("axios");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/addUser", (req, res) => {
  console.log(req.body);
  let temporaryUser = new dataUsers({
    name: req.body.name,
    number: req.body.number,
    email: req.body.email,
    minimumAge: req.body.minimumAge,
    pincode: req.body.pincode,
    notificationsCount: 0,
  });
  temporaryUser.save(function (err, doc) {
    if (err) {
      console.log("Error while adding user to Database");
      res.send("Error while adding user to Database ");
      console.error(err);
    } else {
      console.log("User added to Database successfully");
      res.status(200).send("User added to Database successfully");
    }
  });
});

app.post("/unsubscribeUser", (req, res) => {
  console.log(req.body);
  dataUsers.findOneAndDelete(
    { number: req.body.number },
    (err, unSubscribedUser) => {
      if (unSubscribedUser == null) {
        console.log("User doesn't exist in our Database");
        res.status(202).send("User doesn't exist in our Database");
      } else {
        notifications.sendEmailUnsubcribe(unSubscribedUser).then(() => {
          res
            .status(200)
            .send("Deleted user successfully and mail is sent as well");
        });
      }
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server  started at ${process.env.PORT}`);
});
// when deploying and using cassata uncomment the code below
// const { createProxy, proxySettings } = require("cassata");
// proxySettings.roomId = "admin123";
// proxySettings.password = "admin123";
// createProxy(app).listen(process.env.PORT, () => {
//   console.log("Started");
// });

function traceAvailableCentersEvery10Minutes() {
  dataUsers.find((err, users) => {
    if (err) {
      console.log(err);
    } else {
      users.forEach((user) => {
        var rawCentersArray = [];
        var availableCenters = [];
        rawCenters(user.pincode).then((data) => {
          if (rawCentersArray.length == 0 && availableCenters.length == 0) {
            rawCentersArray = data;
            availableCenters = returnAvailableCenters(user, rawCentersArray);
            rawCentersArray.length = 0;
            if (availableCenters.length > 0) {
              notifications.sendEmail(user, availableCenters).then(() => {
                notifications.sendWhatsappMessage(user, availableCenters);
                notifications.sendSMS(user, availableCenters);
                dataUsers.updateOne(
                  { _id: user._id },
                  { notificationsCount: user.notificationsCount + 1 },
                  (err) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(
                        "Notification sent successfully to user and updated count in Database as well"
                      );
                    }
                  }
                );
              });
              availableCenters.length = 0;
            }
          }
        });
      });
    }
  });
}

// The function traceAvailableCentersEvery10Minutes does the availability check every 10 minutes
setInterval(traceAvailableCentersEvery10Minutes, 10 * 60000);
