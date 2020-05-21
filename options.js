//SELETE  ELEMENTS
const options = document.querySelector(".options");
const gameOverElement = document.querySelector(".gameover");

//SELECT BUTTONS
const computerBtn = options.querySelector(".computer");
const friendBtn = options.querySelector(".friend");
const xBtn = options.querySelector(".x");
const oBtn = options.querySelector(".o");

const easyBtn = options.querySelector(".easy");
const mediumBtn = options.querySelector(".medium");
const hardBtn = options.querySelector(".hard");

const playBtn = options.querySelector(".play");

//SOME VARIABLES TO STORE USER'S OPTIONS
let OPPONENT;
let LEVEL = 2;
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

// easyBtn
// meduimBtn
// hardBtn
easyBtn.addEventListener("click", function () {
  LEVEL = 2;
  switchActiveFor3(easyBtn, mediumBtn, hardBtn);
});
mediumBtn.addEventListener("click", function () {
  LEVEL = 4;
  switchActiveFor3(mediumBtn, easyBtn, hardBtn);
});
hardBtn.addEventListener("click", function () {
  LEVEL = 7;
  switchActiveFor3(hardBtn, mediumBtn, easyBtn);
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
  init(player, OPPONENT, LEVEL);
  options.classList.add("hide");
});

function switchActive(on, off) {
  off.classList.remove("active");
  on.classList.add("active");
}

function switchActiveFor3(on, off1, off2) {
  on.classList.add("active");
  off1.classList.remove("active");
  off2.classList.remove("active");
}
