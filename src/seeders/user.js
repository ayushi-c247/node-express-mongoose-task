const adminModel = require("../models/admin");

const admin = async () => {

  const result = await adminModel.find({ email: "admin@gmail.com" });
  //console.log("my admin result", result)
  if (result.length === 0) {
    await adminModel.create({
      firstName: "Ayushi",
      middleName: "mahesh",
      lastName: "patidar",
      email: "admin@gmail.com",
      password: "Ayushi@77",
      gender: "Female",
    });
  }
}
module.exports = { admin };