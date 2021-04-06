const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const fs = require('fs');
const userSchema = new Schema({
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  name: { type: String, default: "", required: true },
  //middleName: { type: String, default: "" },
  //lastName: { type: String, default: "" },
  Hobbie: {
    type: String,
    default: "",
    enum: ["", "Dance", "painting", "Games"],
  },
  phone: { type: Number, default: " ", required: true },
  age: { type: String, default: " " },
  email: { type: String, default: " ", required: true },
  gender: { type: String, default: "", enum: ["", "Male", "Female", "Other"] }, // M,F,O
  image: { type: String, default: " ", },
  password: { type: String, default: null },
  status: {
    type: String,
    default: "Inactive",
    enum: ["Inactive", "Pending", "Active"],
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog"
  }]
});

module.exports = mongoose.model("User", userSchema)