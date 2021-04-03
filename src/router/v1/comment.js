const express = require("express");
const router = express.Router();
const token = require("../../utils/token")
const { CommentController } = require("../../controller/v1");

router.post("/addComment", token, CommentController.addComment);
router.get("/viewAllComment", token, CommentController.viewAllComment);
router.get("/viewBlogComment/:id", token, CommentController.viewBlogComment);
router.patch("/updateComment", token, CommentController.updateComment);
router.delete("/delete-comment", token, CommentController.deleteComment);
router.delete("/deleteAllComment", token, CommentController.deleteAllComment);
module.exports = router;