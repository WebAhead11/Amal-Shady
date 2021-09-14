// const response = require("express");
const { json } = require("body-parser");
var express = require("express");
var router = express.Router();

var cred = [
  { email: "amal@amal.com", password: "amal1234", username: "amal" },
  { email: "shady@shady.com", password: "shady1234", username: "shady" },
  { email: "kav@mashve.com", password: "kavmashve", username: "kavmashve" },
];
router.post("/login", (req, res) => {
  const user = cred.find((u) => {
    return u.email === req.body.email && u.password === req.body.password;
  });

  if (user) {
    res.cookie(
      "user",
      JSON.stringify({
        email: user.email,
        username: user.username,
      })
    );
    req.session.user = req.body.email;
    res.redirect("/dashboard");
  } else {
    res.end("Unregistered User");
  }
});
router.post("/chatbox", (req, res) => {
  res.redirect("/chat");
});
module.exports = router;
