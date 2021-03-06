const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 3000;
// const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
// const userLeave = require('.utils/users')
// const SECRET = "bJ#M!7c^34h%d";

const session = require("express-session");
const messageFormater = require("./model/messages");
//setting up the server to accept socket io
const socketio = require("socket.io");
const router = require("./router");
const server = http.createServer(app);
const io = socketio(server);

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/route", router);
//renders home page
app.get("/", (req, res) => {
  res.clearCookie("user");
  res.sendFile(path.join(__dirname + "/public/index.html"));
});
app.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});
//renders the chatbox
app.get("/chat", (req, res) => {
  if (req.cookies.user) {
    res.sendFile(path.join(__dirname + "/public/chat.html"));
  } else {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  }
});
io.on("connection", (socket) => {
  var temp = cookie.parse(socket.handshake.headers.cookie);
  var mail = JSON.parse(temp.user);
  socket.emit("message", messageFormater("Admin", "Welcome to the ChatRooms"));
  //sends a message to all users that someone has connected except the user himself
  socket.broadcast.emit(
    "message",
    messageFormater("Admin", `${mail.username} has joined the chat`)
  );

  //when a client dissconects
  socket.on("disconnect", () => {
    io.emit(
      "message",
      messageFormater("Admin", `${mail.username}  has left the chat`)
    );
  });

  //recieve and deal with the messages sent from the chat rooms
  socket.on("chatMessage", (msg) => {
    var temp = cookie.parse(socket.handshake.headers.cookie);
    var mail = JSON.parse(temp.user);

    // we send the message to all the users
    io.emit("message", messageFormater(mail.username, msg));
  });
});

server.listen(PORT, () => console.log("server on http://localhost:3000"));
