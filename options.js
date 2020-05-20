//SELETE  ELEMENTS
const options = document.querySelector(".options");
const gameOverElement = document.querySelector(".gameover");

//SELECT BUTTONS
const computerBtn = options.querySelector(".computer");
const friendBtn = options.querySelector(".friend");
const xBtn = options.querySelector(".x");
const oBtn = options.querySelector(".o");
const playBtn = options.querySelector(".play");

//SOME VARIABLES TO STORE USER'S OPTIONS
let OPPONENT;
const player = new Object();
//ADD AND EVENT LISTENER
computerBtn.addEventListener("click", function () {
  OPPONENT = "computer";
  switchActive(computerBtn, friendBtn);
});
friendBtn.addEventListener("click", function () {
  OPPONENT = "friend";
  switchActive(friendBtn, computerBtn);
});
xBtn.addEventListener("click", function () {
  player.man = "X";
  player.computer = "O";
  player.friend = "O";
  switchActive(xBtn, oBtn);
});
oBtn.addEventListener("click", function () {
  player.man = "O";
  player.computer = "X";
  player.friend = "X";
  switchActive(oBtn, xBtn);
});
playBtn.addEventListener("click", function () {
  if (!OPPONENT) {
    computerBtn.style.backgroundColor = "#f00";
    friendBtn.style.backgroundColor = "#f00";
    return;
  }
  if (!player.man) {
    xBtn.style.backgroundColor = "#f00";
    oBtn.style.backgroundColor = "#f00";
    return;
  }
  init(player, OPPONENT);
  options.classList.add("hide");
});

function switchActive(on, off) {
  off.classList.remove("active");
  on.classList.add("active");
}
