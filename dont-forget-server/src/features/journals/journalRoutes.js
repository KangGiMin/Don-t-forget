const express = require("express");
const router = express.Router();
const controller = require("./journalController");
const { authenticateFirebaseToken } = require("../../middleware/auth");
router.use(authenticateFirebaseToken);
router.get("/", controller.getJournals);
router.put("/", controller.upsertJournal);
router.delete("/:date", controller.deleteJournal);
module.exports = router;
