const express = require("express");
const controller = require("./socialAuthController");

const router = express.Router();
router.get("/:provider/start", controller.start);
router.get("/:provider/callback", controller.callback);

module.exports = router;
