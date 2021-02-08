const port = 3000;
const createError = require("http-errors");
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const helmet = require("helmet");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const topicRouter = require("./routes/topic");
const authRouter = require("./routes/auth");

const app = express();

app.use(helmet());

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "@23t45623!#513res",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.get("*", (req, res, next) => {
  fs.readdir("./data", function (error, filelist) {
    req.list = filelist;
    next();
  });
});

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).send("sorry cant find that");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
