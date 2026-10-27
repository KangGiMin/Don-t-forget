const express = require("express");
const router = express.Router();
const controller = require("./leaderboardController");
const { authenticateFirebaseToken } = require("../../middleware/auth");
router.use(authenticateFirebaseToken);
router.get("/me", controller.getMyStats);
router.get("/", controller.getLeaderboard);
module.exports = router;
