const express = require("express");
const Routes = require("./v1");
// const { test } = require("./../controller/v1/Auth");

const router = express.Router();

router.use("/v1", Routes);
// router.use("/",test )

module.exports = router;
