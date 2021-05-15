const axios = require("axios");

var dateOP = new Date().getDate();
var monthOP = new Date().getMonth() + 1;
var yearOP = new Date().getFullYear();
var dateFormatted = dateOP + "-" + monthOP + "-" + yearOP;
// var rawCenters = [];

async function returnRawCenters(pincode) {
  return new Promise(async (resolve, reject) => {
    const data = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${dateFormatted}`,
      {
        headers: {
          accept: "application/json",
          "Accept-Language": "hi_IN",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
        },
      }
    );
    if (data.status == 200) {
      // console.log(pincode, data.data.centers);
      resolve(data.data.centers);
    } else {
      reject("Data not found");
    }
  });
}

module.exports = returnRawCenters;
