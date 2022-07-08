let optionsCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");

let optionsFlag = true;
//true=show tools, false=hide tools
optionsCont.addEventListener("click", (e) => {
  optionsFlag = !optionsFlag;

  if (optionsFlag) openTools();
  else closeTools();
});
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");

function openTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  iconElem.style.color = "#e7475e";
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  iconElem.style.color = "cornflowerblue";
  toolsCont.style.display = "none";
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");

let pencilFlag = false;

pencil.addEventListener("click", (e) => {
  pencilFlag = !pencilFlag;
  if (pencilFlag) openPencilTool();
  else closePencilTool();
});

function openPencilTool() {
  pencilToolCont.style.display = "block";
}
function closePencilTool() {
  pencilToolCont.style.display = "none";
}

let eraserFlag = false;

eraser.addEventListener("click", (e) => {
  eraserFlag = !eraserFlag;
  if (eraserFlag) openeraserTool();
  else closeeraserTool();
});

function openeraserTool() {
  eraserToolCont.style.display = "flex";
}
function closeeraserTool() {
  eraserToolCont.style.display = "none";
}

let note = document.querySelector(".note");

note.addEventListener("click", (e) => {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-note-cont");
  stickyCont.innerHTML = `
    <div class="header-cont">
        <div class="min-cont"></div>
        <div class="remove-cont"></div>
      </div>
      <div class="note-cont">
        <textarea></textarea>
      </div>`;

  document.body.appendChild(stickyCont);

  let minCont = stickyCont.querySelector(".min-cont");
  let removeCont = stickyCont.querySelector(".remove-cont");

  noteactions(minCont, removeCont, stickyCont);

  stickyCont.onmousedown = function (event) {
    draganddrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
});

function noteactions(minCont, removeCont, stickyCont) {
  removeCont.addEventListener("click", (e) => {
    stickyCont.remove();
  });

  minCont.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");

    if (display === "none") noteCont.style.display = "block";
    else noteCont.style.display = "none";
  });
}

function draganddrop(stickyCont, event) {
  let shiftX = event.clientX - stickyCont.getBoundingClientRect().left;
  let shiftY = event.clientY - stickyCont.getBoundingClientRect().top;

  stickyCont.style.position = "absolute";
  stickyCont.style.zIndex = 1000;
  //   document.body.append(stickyCont);

  moveAt(event.pageX, event.pageY);

  // moves the stickyCont at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    stickyCont.style.left = pageX - shiftX + "px";
    stickyCont.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the stickyCont on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the stickyCont, remove unneeded handlers
  stickyCont.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    stickyCont.onmouseup = null;
  };
}

let upload = document.querySelector(".upload");

upload.addEventListener("click", (e) => {
  // open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-note-cont");
    stickyCont.innerHTML = `
    <div class="header-cont">
        <div class="min-cont"></div>
        <div class="remove-cont"></div>
      </div>
      <div class="note-cont">
       <img src="${url}" />
      </div>`;

    document.body.appendChild(stickyCont);
    let minCont = stickyCont.querySelector(".min-cont");
    let removeCont = stickyCont.querySelector(".remove-cont");

    noteactions(minCont, removeCont, stickyCont);

    stickyCont.onmousedown = function (event) {
      draganddrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
      return false;
    };
  });
});
