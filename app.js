require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/errors");

const {
  validateRegistrationUserBody,
  validateLoginUserBody,
} = require("./middlewares/validation");

const { createUser, login } = require("./controllers/users");

const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

const app = express();

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateLoginUserBody, login);
app.post("/signup", validateRegistrationUserBody, createUser);
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

console.log("listening port 3001");
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {});
