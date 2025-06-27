const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("successful connect to database");
  })
  .catch(console.error());
const app = express();

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
