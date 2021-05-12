const axios = require("axios");

var dateOP = new Date().getDate();
var monthOP = new Date().getMonth() + 1;
var yearOP = new Date().getFullYear();
var dateFormatted = dateOP + "-" + monthOP + "-" + yearOP;
var rawCenters = [];

function returnRawCenters(pincode) {
  axios
    .get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${dateFormatted}`
    )
    .then((data) => {
      rawCenters = data.data;
      return rawCenters;
    });
}

module.exports = returnRawCenters;
