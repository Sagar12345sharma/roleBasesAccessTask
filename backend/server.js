const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/user");
const passport = require("passport");
require("dotenv/config");
const Logger = require("./logger/index");

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(passport.initialize());
require("./routes/authentication/passport");

const api = process.env.API_URL;

app.use(`${api}/`, userRouter);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "recoveroDatabase",
  })
  .then(() => {
    Logger.info("Database Connection is ready");
  })
  .catch((err) => {
    Logger.error(err);
  });

app.listen(5000, () => {
  Logger.info("server is running http://localhost:5000");
});
