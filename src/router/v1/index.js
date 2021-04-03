const express = require("express");
const AuthRouter = require("./auth");
const BlogRouter = require("./blog");
const CommentRouter = require("./comment");
const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/comment", CommentRouter);
router.use("/blog", BlogRouter);

module.exports = router;
