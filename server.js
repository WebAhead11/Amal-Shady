const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 3000;
const cookie = require("cookie");
const cookieParser = require("cookie-parser");

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

//renders home page
app.get("/", (req, res) => {
  // res.render("index", { title: "Login" });
  res.sendFile(path.join(__dirname + "/public/index.html"));
});
//renders dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/dashboard.html"));
});
//renders the chatbox
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/chat.html"));
});

io.on("connection", (socket) => {
  socket.emit("message", messageFormater("Admin", "Welcome to the ChatRooms"));

  //sends a message to all users that someone has connected except the user himself
  socket.broadcast.emit(
    "message",
    messageFormater("Admin", "A user has joined the chat")
  );

  //when a client dissconects
  socket.on("disconnect", () => {
    io.emit("message", messageFormater("Admin", "A user has left the chat"));
  });

  //recieve and deal with the messages sent from the chat rooms
  socket.on("chatMessage", (msg) => {
    var temp = cookie.parse(socket.handshake.headers.cookie);
    console.log(temp);
    var mail = JSON.parse(temp.user);

    // we send the message to all the users
    io.emit("message", messageFormater(mail.username, msg));
  });
});

server.listen(PORT, () => console.log("server on http://localhost:3000"));
