// const { Socket } = require("socket.io");

let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let penColor = "#005792";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let undoredotracker = [];
let track = 0;

//api
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

let mousedown = false;
canvas.addEventListener("mousedown", (e) => {
  mousedown = true;
  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginpath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mousedown) {
    let data = {
      color: eraserFlag ? eraserColor : penColor,
      width: eraserFlag ? eraserWidth : penWidth,
      x: e.clientX,
      y: e.clientY,
    };
    socket.emit("drawstroke", data);
  }
});

canvas.addEventListener("mouseup", (e) => {
  mousedown = false;

  let url = canvas.toDataURL();
  undoredotracker.push(url);
  track = undoredotracker.length - 1;
});

undo.addEventListener("click", (e) => {
  if (track > 0) track--;
  let data = {
    trackValue: track,
    undoredotracker
  };
  socket.emit("undoredo", data);
});

redo.addEventListener("click", (e) => {
  if (track < undoredotracker.length - 1) track++;
  let data = {
    trackValue: track,
    undoredotracker
  };
  socket.emit("undoredo", data);
});

function undoredocanvas(trackObj) {
  track = trackObj.trackValue;
  undoredotracker = trackObj.undoredotracker;

  let url = undoredotracker[track];
  let img = new Image();
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

function beginpath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawstroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    penColor = color;
    tool.strokeStyle = color;
  });
});

pencilWidthElem.addEventListener("change", (e) => {
  penWidth = pencilWidthElem.value;
  tool.lineWidth = penWidth;
});

eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
});

eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});

let download = document.querySelector(".download");

download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

socket.on("beginpath", (data) => {
  //data-> data from server
  beginpath(data);
});

socket.on("drawstroke", (data) => {
  drawstroke(data);
});

socket.on("undoredo", (data) => {
  undoredocanvas(data);
});
