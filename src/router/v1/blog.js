const express = require("express");
const router = express.Router();

const upload = require("../../utils/multer")
const token = require("../../utils/token")
const { BlogController } = require("../../controller/v1");
const { AuthValidator } = require("../../validators");


router.post("/userBlog", token, upload.fields([{ name: 'posterImage', maxCount: 1 }, { name: 'thumbnailImage', maxCount: 3 }]), AuthValidator.blogvalidations, BlogController.userBlog);
router.get("/viewAllBlog", token, BlogController.viewAllBlog);
router.get("/viewUserBlog", token, BlogController.viewUserBlog);
router.patch("/updateBlog/:id", token, upload.fields([{ name: 'posterImage', maxCount: 1 }, { name: 'thumbnailImage', maxCount: 3 }]), BlogController.updateBlog);
router.delete("/deleteBlog/:id", token, BlogController.deleteBlog);
router.delete("/deleteAllBlogs", token, BlogController.deleteAllBlogs);
router.get("/userAndBlog", token, BlogController.userAndBlog);
router.patch("/likesDislikes/:id", token, BlogController.likesDislikes);


module.exports = router;
