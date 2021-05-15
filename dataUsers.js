const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();
var dataUsers = [];

mongoose.connect(
  "mongodb+srv://Yash-1410:" +
    process.env.ATLAS +
    "@cluster0.hyy3y.mongodb.net/vaccineDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.on("connected", () => {
  console.log("DB OP");
});

const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  email: String,
  pincode: String,
  minimumAge: String,
  notificationsCount: Number,
});
const User = mongoose.model("User", userSchema);

const OP = User({
  name: "Yash",
  number: "8888361969",
  email: "nehasalvi31.ns@gmail.com",
  pincode: "411043",
  minimumAge: "45",
  notificationsCount: 0,
});
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
