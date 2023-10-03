const express = require("express");
const mongoose = require("mongoose");
const voteHandler = require("./routeHandler/voteHandler");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `${process.env.DB_URL}`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose Connection successful"))
  .catch((err) => console.log(err));

app.use("/api/vote", voteHandler);

app.get("/", (req, res) => {
  res.send("I am Vote server.");
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(port, () => {
  console.log("app listening at port", port);
});
