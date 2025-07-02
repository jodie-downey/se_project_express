const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("successful connect to database");
  })
  .catch(console.error);

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "6863c083334cbd70ff9961cf",
  };
  next();
});
app.use(express.json());
app.use("/", mainRouter);

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
