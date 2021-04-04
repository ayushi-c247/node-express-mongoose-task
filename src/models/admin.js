const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstName: { type: String, default: "", required: true },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: null },
    gender: { type: String, default: "", enum: ["", "Male", "Female", "Other"] }, 
    password: { type: String, default: null },
    //profilePicture: { type: String, default: null },
    //password: { type: String, default: null },
    // status: {
    //     type: String,
    //     default: "Active",
    //     enum: ["Pending", "Active", "Inactive"],
    // },
});

module.exports = mongoose.model("Admin", adminSchema)