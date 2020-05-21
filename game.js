function init(player, OPPONENT, LEVEL) {
  // select canvas
  const canvas = document.getElementById("cvs");
  const ctx = canvas.getContext("2d");
  // initialize values
  let board = [];
  let LOADING_STATE = false;
  const COLUMN = 7;
  const ROW = 7;
  const SPACE_SIZE = 100;

  const xImage = new Image();
  xImage.src = "img/X1.png";

  const oImage = new Image();
  oImage.src = "img/O1.png";

  // By default the first player to play is the human
  let currentPlayer = player.man;

  //Match Combo
  const MATCH_COMBO = [
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
    ],
    [
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
    ],
    [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [6, 4],
    ],
    [
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
      [6, 5],
    ],
    [
      [0, 6],
      [1, 6],
      [2, 6],
      [3, 6],
      [4, 6],
      [5, 6],
      [6, 6],
    ],
  ];

  function drawBoard() {
    for (let i = 0; i < ROW; i++) {
      board[i] = [];
      for (let j = 0; j < COLUMN; j++) {
        board[i][j] = null;
        ctx.strokeStyle = "#000";
        // ctx.setLineDash([5, 3]);
        ctx.font = "15px Arial";
        ctx.strokeRect(i * SPACE_SIZE, j * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
        ctx.fillText(`[${i}, ${j}]`, i * SPACE_SIZE, j * SPACE_SIZE + 20);
      }
    }
  }
  drawBoard();

  //click event
  canvas.addEventListener("click", function (event) {
    if (LOADING_STATE) return;
    // X & Y position of mouse click relative to the canvas
    let X = event.clientX - canvas.getBoundingClientRect().x;
    let i = Math.floor(X / SPACE_SIZE);

    let positions = getPosition(i, board);
    //check if value exist
    if (!positions) return;
    // prevent the player to play the same space twice
    if (board[positions[0]][positions[1]]) return;
    board[positions[0]][positions[1]] = currentPlayer;
    // draw the move on board
    drawOnBoard(currentPlayer, positions[0], positions[1]);

    // Check if the play wins
    if (isWinner(board, currentPlayer)) {
      showGameOver(currentPlayer);
      return;
    }
    // check if it's a tie game
    if (isTie(board)) {
      showGameOver("tie");
      return;
    }
    //check if the play tie
    //give next turn
    if (OPPONENT == "computer") {
      //For AI
      LOADING_STATE = true;
      generateComputerDecision();
    } else {
      //for User
      currentPlayer = currentPlayer == player.man ? player.friend : player.man;
    }
  });

  function generateComputerDecision() {
    setTimeout(() => {
      LOADING_STATE = false;
      let startTime = new Date().getTime();
      //minimax algorithm
      let aiMove = maximizePlay(board, LEVEL);
      let positions = getPosition(aiMove[0], board);
      // // prevent the player to play the same space twice
      if (board[positions[0]][positions[1]]) return;
      board[positions[0]][positions[1]] = player.computer;
      // // draw the move on board
      drawOnBoard(player.computer, positions[0], positions[1]);
      // Check if the play wins
      if (isWinner(board, player.computer)) {
        showGameOver(player.computer);
        return;
      }
      // check if it's a tie game
      if (isTie(board)) {
        showGameOver("tie");
        return;
      }
      let endTime = new Date().getTime() - startTime;
      console.log("generateComputerDecision", endTime);
    }, 500);
  }

  //ai part
  function maximizePlay(board, level) {
    // BASE
    if (isWinner(board, player.computer)) return [null, 10];
    if (isWinner(board, player.man)) return [null, -10];
    if (isTie(board)) return [null, 0];
    // recursive break
    if (level == 0) return [null, 0];
    // Column, Score
    var max = [null, -99999];

    for (let i = 0; i < 7; i++) {
      //copy board
      let newBoard = JSON.parse(JSON.stringify(board));
      // place value
      let positions = getPosition(i, newBoard);
      if (positions) {
        newBoard[positions[0]][positions[1]] = player.computer;
        let nextMove = minimizePlay(newBoard, level - 1);

        // Evaluate new move
        if (max[0] == null || nextMove[1] > max[1]) {
          max[0] = i;
          max[1] = nextMove[1];
        }
      }
    }

    return max;
  }
  //user part
  function minimizePlay(board, level) {
    // BASE
    if (isWinner(board, player.computer)) return [null, 10];
    if (isWinner(board, player.man)) return [null, -10];
    if (isTie(board)) return [null, 0];
    // recursive break
    if (level == 0) return [null, 0];
    // Column, score
    var min = [null, 99999];

    for (let i = 0; i < 7; i++) {
      let newBoard = JSON.parse(JSON.stringify(board));
      let positions = getPosition(i, newBoard);
      if (positions) {
        newBoard[positions[0]][positions[1]] = player.man;
        let nextMove = minimizePlay(newBoard, level - 1);
        if (min[0] == null || nextMove[1] < min[1]) {
          min[0] = i;
          min[1] = nextMove[1];
        }
      }
    }
    return min;
  }

  // function setPosition(newBoard, row) {
  //   let selectedArray = newBoard[row];
  //   console.log(selectedArray);
  //   console.log(row);

  //   for (let i = 7 - 1; i >= 0; i--) {
  //     if (selectedArray[i] == null) {
  //       newBoard[row][i] = currentPlayer; // Set current user
  //       break;
  //     }
  //     currentPlayer == player.man ? player.computer : player.man;
  //     console.log(currentPlayer);
  //     return true;
  //   }
  // }

  // draw on board
  function drawOnBoard(player, i, j) {
    let img = player == "X" ? xImage : oImage;
    ctx.drawImage(img, i * SPACE_SIZE, j * SPACE_SIZE);
  }

  function getPosition(row, board) {
    let selectedArray = board[row];
    for (let i = 7 - 1; i >= 0; i--) {
      if (selectedArray[i] == null) {
        return [row, i];
      }
    }
    return false;
  }

  function isWinner(board, player) {
    // verticalCheck & horizontalCheck;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          board[j][i] == player &&
          board[j][i + 1] == player &&
          board[j][i + 2] == player &&
          board[j][i + 3] == player
        ) {
          return true;
        }
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          board[i][j] == player &&
          board[i + 1][j] == player &&
          board[i + 2][j] == player &&
          board[i + 3][j] == player
        ) {
          return true;
        }
      }
    }
    //crossCheckFromLeft & crossCheckFromRight
    for (let i = 3; i < 7; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          board[i][j] == player &&
          board[i - 1][j + 1] == player &&
          board[i - 2][j + 2] == player &&
          board[i - 3][j + 3] == player
        ) {
          return true;
        }
      }
    }
    for (let i = 3; i < 7; i++) {
      for (let j = 3; j < 7; j++) {
        if (
          board[i][j] == player &&
          board[i - 1][j - 1] == player &&
          board[i - 2][j - 2] == player &&
          board[i - 3][j - 3] == player
        ) {
          return true;
        }
      }
    }
  }

  function isTie(board) {
    let isBoardFill = true;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j]) return false;
      }
    }
    if (isBoardFill) {
      return true;
    }
  }

  //show game
  function showGameOver(player) {
    let message = player == "tie" ? "Oops No Winner" : "The Winner is";
    let imgSrc = `img/${player}1.png`;

    gameOverElement.innerHTML = `
              <h1>${message}</h1>
              <img class="winner-img" src=${imgSrc}> </img>
              <div class="play" onclick="location.reload()">Play Again!</div>
          `;

    gameOverElement.classList.remove("hide");
  }
}
