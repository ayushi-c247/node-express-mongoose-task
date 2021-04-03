const express = require("express");
const router = express.Router();
const upload = require("../../utils/multer")
const token = require("../../utils/token")
const { AuthController } = require("../../controller/v1");

router.post("/registration", upload.array('myfile', 3), AuthController.registration);
router.get("/login", AuthController.login);
router.get("/profile", token, AuthController.viewProfile);
router.patch("/updateprofile", token, upload.array('myfile', 3), AuthController.updateProfile);
router.delete("/delete-profile", token, AuthController.deleteProfile);
router.patch("/delete-profileImage", token, AuthController.deleteProfileImage);
router.get("/userAndBlog", token, AuthController.userAndBlog);
module.exports = router;
