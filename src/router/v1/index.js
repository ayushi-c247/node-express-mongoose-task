const express = require("express");
const AuthRouter = require("./auth");
const BlogRouter = require("./blog");
const CommentRouter = require("./comment");
const AdminRouter = require("./admin");
const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/comment", CommentRouter);
router.use("/blog", BlogRouter);
router.use("/admin", AdminRouter);

module.exports = router;
