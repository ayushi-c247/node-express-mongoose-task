const express = require("express");
const router = express.Router();

const token = require("../../utils/token")
const { CommentController } = require("../../controller/v1");

router.post("/addComment", token, CommentController.addComment);
router.get("/viewAllComment", token, CommentController.viewAllComment);
router.get("/viewBlogComment/:id", token, CommentController.viewBlogComment);
router.patch("/updateComment/:id", token, CommentController.updateComment);
router.delete("/delete-comment/:id", token, CommentController.deleteComment);


module.exports = router;