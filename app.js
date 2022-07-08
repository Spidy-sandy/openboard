const express = require("express");
const socket = require("socket.io");

const app = express(); //initialize and server ready

app.use(express.static("public"));

let port = 2000;

let server = app.listen(port, () => {
  console.log("listening to port" + port);
});

let io = socket(server);

io.on("connection", (socket) => {
  console.log("made socket connection");
  //received data
  socket.on("beginpath", (data) => {
    //transfer
    io.sockets.emit("beginpath", data);
  });

  socket.on("drawstroke", (data) => {
    io.sockets.emit("drawstroke", data);
  });

  socket.on("undoredo", (data) => {
    io.sockets.emit("undoredo", data);
  });
});
