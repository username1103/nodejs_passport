const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");

const fs = require("fs");
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const topicRouter = require("./routes/topic");
const authRouter = require("./routes/auth");

const app = express();
const port = 3000;

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
    // store: new FileStore(), // 파일 스토어를 이용하는 경우 세션 데이터를 파일로 저장하는 시간에 의해서 에러가 발생함
  })
);

// authData
const authData = {
  email: "auddlf419@naver.com",
  password: "auddlf123",
  nickname: "myeongil",
};

// passport import
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// passport initialize and use session
app.use(passport.initialize());
app.use(passport.session());

// serialize user
// save user identifier in sessions
passport.serializeUser(function (user, done) {
  console.log("serializeUser", user);
  // user.email = user identifier => save data in sessions
  done(null, user.email);
});

// When visit page, active this function
// In session, user's data is id
passport.deserializeUser(function (id, done) {
  console.log("deserializeUser", id);
  // Add authData in request's user
  done(null, authData);
});

passport.use(
  // username, password settings
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    // compare usename and password
    function (username, password, done) {
      console.log("LocalStartegy", username, password);
      if (username === authData.email) {
        if (password === authData.password) {
          return done(null, authData);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      } else {
        return done(null, false, { message: "Incorrect username." });
      }
    }
  )
);

// login event process
app.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
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
