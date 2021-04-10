const express = require("express");
const router = express.Router();

const upload = require("../../utils/multer");
const token = require("../../utils/token");
const { AuthController } = require("../../controller/v1");
const { AuthValidator } = require("../../validators");

router.post("/registration", upload.array('myfile', 1), AuthValidator.RegistrationValidation, AuthController.registration);
router.get("/login", AuthValidator.LoginValidation, AuthController.login);
router.get("/profile", token, AuthController.viewProfile);
router.patch("/updateprofile", token, upload.array('myfile', 1), AuthController.updateProfile);
router.delete("/delete-profile", token, AuthController.deleteProfile);
router.patch("/delete-profileImage", token, AuthController.deleteProfileImage);

module.exports = router;
