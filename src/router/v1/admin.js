const express = require("express");
const router = express.Router();

const token = require("../../utils/token")
const { AdminController } = require("../../controller/v1");




router.post("/adminlogin", AdminController.adminLogin);
router.get("/a", AdminController.helloprogram);
router.post("/process_post", AdminController.login);
router.get("/delete/:id", AdminController.deleteUser);
router.get("/display", AdminController.display);



module.exports = router;