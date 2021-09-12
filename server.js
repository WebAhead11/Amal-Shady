const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const socketio = require("socket.io");
const router = require("./router");
const server = http.createServer(app);
const io = socketio(server);

app.use(express.urlencoded());
app.use(express.json());
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/route", router);
//home
app.get("/", (req, res) => {
  res.render("index", { title: "Login" });
});
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});
io.on("connection", (socket) => {
  console.log("Connection success");
});
app.listen(PORT, () => console.log("server on http://localhost:3000"));
