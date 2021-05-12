const axios = require("axios");
const mongoose = require("mongoose");
var dataUsers = [];

mongoose.connect("mongodb://localhost:27017/vaccineDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("DB OP");
});

const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  pincode: String,
  minimumAge: String,
});
const User = mongoose.model("User", userSchema);

// const OP = User({
//   name: "Yash",
//   number: "8888361969",
//   pincode: 411043,
//   minimumAge: "45",
// });
// OP.save();
// const dataUsers = [
//   {
//     name: "Yash",
//     number: "8888361969",
//     pincode: 411043,
//     minimumAge: "45",
//   },
// ];
module.exports = User;
