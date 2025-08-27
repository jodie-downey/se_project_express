const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes/index");

const { createUser, login, updateCurrentUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", mainRouter);
app.use(auth);
app.use("/me", updateCurrentUser);

console.log("listening port 3001");
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {});
