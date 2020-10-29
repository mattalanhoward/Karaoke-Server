const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("./config/db.config");
require("dotenv").config();

//Router definition
const userRouter = require("./routes/user.route");
const profileRouter = require("./routes/profile.route");
const searchRouter = require("./routes/search.route");
const singerSongRouter = require("./routes/singerSong.route");
const queueRouter = require("./routes/queue.route");

const app = express();

//CORS configuration
app.use(
  cors({
    credentials: true,
    origin: "https://noda-101.netlify.app/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/search", searchRouter);
app.use("/singerSong", singerSongRouter);
app.use("/queue", queueRouter);

module.exports = app;
