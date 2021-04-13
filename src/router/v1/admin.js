const express = require("express");
const router = express.Router();

const token = require("../../utils/token")
const { AdminController } = require("../../controller/v1");
const { AuthValidator } = require("../../validators");
const sessionChecker = require("../../utils/session")

router.post("/adminlogin", AuthValidator.AdminLoginValidation, AdminController.adminLogin);

router.get("/login", AdminController.homePage);
router.get("/logout", AdminController.logout);
router.post("/dashboard", AdminController.login);
router.get("/delete/:id", AdminController.deleteUser);
router.get("/display", AdminController.display);
router.get("/userStatusUpdate/:id", AdminController.userStatusUpdate);
router.get("/adminDashboard", AdminController.adminDashboard);


module.exports = router;