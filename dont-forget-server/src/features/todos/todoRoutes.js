const express = require("express");
const router = express.Router();
const todoController = require("./todoController");
const { authenticateFirebaseToken, requireSelf } = require("../../middleware/auth");

router.use(authenticateFirebaseToken);

router.post("/", todoController.createTodo);
router.get("/", todoController.getTodos);
router.get("/:userId", requireSelf("userId"), todoController.getTodos);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
