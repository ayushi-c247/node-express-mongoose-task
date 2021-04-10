const bcrypt = require("bcrypt");

const adminModel = require("../models/admin");

const admin = async () => {

  const result = await adminModel.find({ email: "admin@gmail.com" });
  var password = "Ayushi@77";
  const generateSalt = (length = 10) => bcrypt.genSaltSync(length);
  const encryptPassword = (password) => {
    const salt = generateSalt(10);
    return bcrypt.hashSync(password, salt);
  };
  if (result.length === 0) {
    await adminModel.create({
      firstName: "Ayushi",
      middleName: "mahesh",
      lastName: "patidar",
      email: "admin@gmail.com",
      password: encryptPassword(password),
      gender: "Female",
    });
  }
}
module.exports = { admin };