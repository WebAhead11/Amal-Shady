//to manipulate the chatbox
const chatForm = document.getElementById("chat-form");
//
const chatMessages = document.getElementById("ChatBox");
const socket = io();

socket.on("message", (message) => {
  outputMessage(message);

  //to enable scrolling up and down the conversation
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message delivering
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = event.target.elements.msg.value;
  socket.emit("chatMessage", message);
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});
//html manipulation with dom
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
  ${message.msg}</p> `;
  document.getElementById("ChatBox").appendChild(div);
}
//activates the 'log out' button
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "/";
  }
});
