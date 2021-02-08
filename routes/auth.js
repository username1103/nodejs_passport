const express = require("express");
const router = express.Router();
const template = require("../lib/template");

const authData = {
  email: "auddlf419@naver.com",
  password: "auddlf123",
  nickname: "myeongil",
};

router.get("/login", (req, res) => {
  const title = "WEB - login";
  const list = template.list(req.list);
  var html = template.HTML(
    title,
    list,
    `
    <form action="/auth/login" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p>
            <input type="text" name="password" placeholder="password">
        </p>
        <p>
        <input type="submit">
        </p>
    </form>
    `,
    "",
    `<a href="/auth/login">login</a>`
  );
  res.send(html);
});

router.post("/login", (req, res) => {
  const body = req.body;
  if (body.email === authData.email && body.password === authData.password) {
    req.session.logined = true;
    req.session.nickname = authData.nickname;
    req.session.save(() => {
      res.redirect("/");
    });
  } else {
    res.send("Who?");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

module.exports = router;
