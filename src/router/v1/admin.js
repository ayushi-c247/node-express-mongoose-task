const express = require("express");
const router = express.Router();

const token = require("../../utils/token")
const { AdminController } = require("../../controller/v1");




router.post("/adminlogin", AdminController.adminLogin);

module.exports = router;