// const response = require("express");
var express = require("express");
var router = express.Router();

const cred = {
  email: "test@test.com",
  password: "test1234",
  email: "shady@shady.com",
  password: "shady1234",
  email: "amal@amal.com",
  password: "amal1234",
};

router.post("/login", (req, res) => {
  if (req.body.email == cred.email && req.body.password == cred.password) {
    req.session.user = req.body.email;
    res.redirect("/dashboard");
  } else {
    res.end("Unregistered User");
  }
});

module.exports = router;
