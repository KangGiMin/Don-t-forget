const express = require("express");
const cors = require("cors");
const todoRoutes = require("./features/todos/todoRoutes");
const userRoutes = require("./features/users/userRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/api/todos", todoRoutes);
app.use("/api", userRoutes);

app.get("/", (_req, res) => {
  res.send("Node(백엔드) 서버가 오픈되었습니다!");
});

module.exports = app;
