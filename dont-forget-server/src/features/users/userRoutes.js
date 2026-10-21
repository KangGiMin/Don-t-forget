const express = require("express");
const router = express.Router();
const userController = require("./userController");
const { authenticateFirebaseToken, requireSelf } = require("../../middleware/auth");
const { contactRateLimit } = require("../../middleware/contactRateLimit");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/find-id", userController.findId);
router.put("/users/:id", authenticateFirebaseToken, requireSelf("id"), userController.updateProfile);
router.get("/users/:id", authenticateFirebaseToken, requireSelf("id"), userController.getUserInfo);
router.post("/contact", authenticateFirebaseToken, contactRateLimit, userController.contactAdmin);

module.exports = router;

