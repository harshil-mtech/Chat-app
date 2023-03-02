const socket = io();

// DOM Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormBtn = $messageForm.querySelector("button");
const $locationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMsgTemplate = document.querySelector(
  "#locationMsg-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New msg element
  $newMessage = $messages.lastElementChild;

  // Height of new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageHeight =
    $newMessage.offsetHeight + parseInt(newMessageStyles.marginBottom);

  // Visible Height
  const visibleHeight = $messages.offsetHeight;

  // Message Container Height
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log(message);

  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });

  $messages.insertAdjacentHTML("beforeend", html);

  autoscroll();
});

socket.on("locationMessage", (message) => {
  console.log(message);

  const html = Mustache.render(locationMsgTemplate, {
    url: message.url,
    username: message.username,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);

  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });

  document.querySelector(".chat__sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  $messageFormBtn.setAttribute("disabled", "disabled");

  e.preventDefault();
  const msg = $messageFormInput.value;

  socket.emit("sendMessage", msg, (ack) => {
    $messageFormBtn.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (ack) return console.log(ack);

    console.log("Message delivered!");
  });
});

$locationBtn.addEventListener("click", () => {
  $locationBtn.setAttribute("disabled", "disabled");

  if (!navigator.geolocation)
    return alert("Geolocation is not supported by your browser");

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    socket.emit("sendLocation", { latitude, longitude }, () => {
      $locationBtn.removeAttribute("disabled");

      console.log("Location has been shared!");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
