require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fast2smsAuth = process.env.FAST_TWO_SMS;
const fast2sms = require("fast-two-sms");
const client = require("twilio")(accountSid, authToken);

function sendSMS(user, centers) {
  var messageOP = `Hello ${user.name}, the centers available in pincode are ${user.pincode}:`;
  messageOP += createMessage(centers);
  const { wallet } = fast2sms.getWalletBalance(fast2smsAuth);
  console.log(wallet);
  var options = {
    authorization: fast2smsAuth,
    message: messageOP,
    numbers: [user.number],
  };
  fast2sms.sendMessage(options); //Asynchronous Function.
}

function sendWhatsappMessage(user, centers) {
  var messageOP = `Hello ${user.name}, the centers available in pincode are ${user.pincode}:`;
  messageOP += createMessage(centers);
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: messageOP,
      to: "whatsapp:+91" + user.number,
    })
    .then((message) => console.log(message.sid));
}

function createMessage(xD) {
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
module.exports.sendSMS = sendSMS;
module.exports.sendWhatsappMessage = sendWhatsappMessage;
