require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fast2smsAuth = process.env.FAST_TWO_SMS;
const fast2sms = require("fast-two-sms");
const client = require("twilio")(accountSid, authToken);
const nodeMailer = require("nodemailer");

function sendEmail(user, centers) {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var messageOP = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"><style>body{font-family:Arial,Helvetica,sans-serif}#sessions{border-collapse:collapse;width:100%}#sessions td, #sessions th{border:1px solid #ddd;padding:8px}#sessions tr:nth-child(even){background-color:#f2f2f2}#sessions tr:hover{background-color:#ddd}#sessions th{padding-top:12px;padding-bottom:12px;text-align:left;background-color:#4CAF50;color:white}.intro{margin-top:0px;margin-bottom:0px}.centerName{margin-top:0px;margin-bottom:1px}.centerAddress{margin-bottom:5px;margin-top:3px}#centerSingle{margin-bottom:25px}.button{background-color:#4CAF50;border:none;color:white;padding:8px 14px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;margin:4px 2px;transition-duration:0.4s;cursor:pointer}.button1{color:white;border:2px solid #4CAF50}.button1:hover{background-color:white;color:black}.unsubscribeText{margin-bottom:0.2rem}</style></head><body><div class="container"><h2 class="intro">Hello ${user.name} , centers available at pincode ${user.pincode} are :</h2> <br>`;
  messageOP += createHTMLForMail(centers);
  messageOP += `<div class="container"><p class="unsubcribeText">If you've booked an appointment and don't want to get emails hereafter click the button below</p> <a href="https://tetrad-3114.herokuapp.com/" ><button class="button button1">Unsubcribe</button></a></div></div></body> <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script> <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script> </html>`;
  let mailOptions = {
    from: "vaccinecentersnearyour@gmail.com",
    to: user.email,
    subject: `VACCINE CENTERS AT PINCODE:${user.pincode}`,
    text: messageOP,
    html: messageOP,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error while sending email" + err);
        reject();
      } else {
        console.log("Email is sent successfully ");
        resolve();
      }
    });
  });
}

// function sendSMS(user, centers) {
//   var messageOP = `Centers: `;
//   messageOP += createMessageForSMS(centers);
//   var options = {
//     authorization: fast2smsAuth,
//     message: messageOP,
//     numbers: [user.number],
//   };
//   fast2sms.sendMessage(options).then((response) => {
//     console.log(response);
//   }); //Asynchronous Function.
// }

function sendWhatsappMessage(user, centers) {
  console.log(user.number);
  var messageOP = `Hello ${user.name}, the centers available in pincode are ${user.pincode}:`;
  messageOP += createMessageForWhatsappAndMail(centers);
  messageOP += `</body></html>`;
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: messageOP,
      to: "whatsapp:+91" + user.number,
    })
    .then((message) => console.log(message.sid));
  // console.log(k + " whatsapp OP " + messageOP.substr(0, 6));
}

function sendEmailUnsubcribe(user) {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var messageOP = createHTMLForUnsubcribe(user);
  let mailOptions = {
    from: "vaccinecentersnearyour@gmail.com",
    to: user.email,
    subject: `UNSUBSCRIBED FROM VACCIFY SUCCESSFULLY`,
    text: messageOP,
    html: messageOP,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error while sending unsunscribed email" + err);
        reject();
      } else {
        console.log("Email is sent successfully and user is unsubcribed");
        resolve();
      }
    });
  });
}
function createMessageForWhatsappAndMail(xD) {
  var str = "";
  xD.forEach((center, index) => {
    str += `Center number ${index + 1} is Hospital ${
      center.centerName
    } located at ${center.centerAddress} and has vaccine available at dates:`;
    center.sessionsInCenter.forEach((session) => {
      str += `${session.sessionDate}(Available Capacity:${session.sessionAvailableCapacity} amd vaccine name is ${session.sessionVaccine}), `;
    });
    str += " . ";
  });
  return str;
}
// function createMessageForSMS(xD) {
//   var str = "";
//   xD.forEach((center, index) => {
//     str += `${center.centerName},Dates:`;
//     center.sessionsInCenter.forEach((session, indexOP) => {
//       if (indexOP < 2) {
//         str += `${session.sessionDate}(Doses_Available:${session.sessionAvailableCapacity}),`;
//       }
//     });
//     str += ";";
//   });
//   return str;
// }
function createHTMLForMail(xD) {
  var str = "";
  xD.forEach((center, index) => {
    str += `<div id="centerSingle"><div id="center"><h3 class="centerName">Center ${
      index + 1
    } : ${center.centerName} <br><h5 class="centerAddress">Address:${
      center.centerAddress
    }</h5></h3></div><table id="sessions"><tr><th>Date</th><th>Available Capacity</th><th>Vaccine Name</th></tr>`;
    center.sessionsInCenter.forEach((session) => {
      str += `<tr><td>${session.sessionDate}</td><td>${session.sessionAvailableCapacity}</td><td>${session.sessionVaccine}</td></tr>`;
    });
    str += `</table></div>`;
  });
  return str;
}
function createHTMLForUnsubcribe(user) {
  var messageOP = `<!doctype html><html lang="en" class="h-100"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"><style>.copyright{font-size:1rem;margin:0 auto 5%}</style><title>Hello, world!</title></head><body class="h-100"><div class="jumbotron h-100"><h1 class="display-4">Thank You ${user.name}</h1><p class="lead">We hope we helped you to book a vaccine appointment😀</p><hr class="my-4"><p></p><p class="copyright text-center fixed-bottom"> &copy; Vaccify💉</p></div> <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script> <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script> </body></html>`;
  return messageOP;
}
module.exports.sendEmail = sendEmail;
// module.exports.sendSMS = sendSMS;
module.exports.sendWhatsappMessage = sendWhatsappMessage;
module.exports.sendEmailUnsubcribe = sendEmailUnsubcribe;
