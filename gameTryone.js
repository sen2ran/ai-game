function init(player, OPPONENT) {
  // SELECT CANAVS
  const canvas = document.getElementById("cvs");
  const ctx = canvas.getContext("2d");

  // BOARD VARIABLES
  let board = [];
  const COLUMN = 7;
  const ROW = 7;
  const SPACE_SIZE = 100;

  // STORE PLAYER'S MOVES
  let gameData = new Array(49);

  // By default the first player to play is the human
  let currentPlayer = player.man;

  // load X & O images
  const xImage = new Image();
  xImage.src = "img/X1.png";

  const oImage = new Image();
  oImage.src = "img/O1.png";

  //Match Combo
  const MATCH_COMBO = [
    [0, 7, 14, 21, 28, 35, 42],
    [1, 8, 15, 22, 29, 36, 43],
    [2, 9, 16, 23, 30, 37, 44],
    [3, 10, 17, 24, 31, 38, 45],
    [4, 11, 18, 25, 32, 39, 46],
    [5, 12, 19, 26, 33, 40, 47],
    [6, 13, 20, 27, 34, 41, 48],
  ];

  // DRAW THE BOARD
  function drawBoard() {
    // WE give every space a unique id
    // So we know exactly where to put the player's move on the gameData Array
    let id = 0;
    for (let i = 0; i < ROW; i++) {
      board[i] = [];
      for (let j = 0; j < COLUMN; j++) {
        board[i][j] = {
          id: id,
          val: null,
        };
        id++;

        // draw the spaces
        ctx.strokeStyle = "#000";
        ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
      }
    }
    // console.log(board);
  }
  drawBoard();

  // ON PLAYER'S CLICK
  canvas.addEventListener("click", function (event) {
    // X & Y position of mouse click relative to the canvas
    let X = event.clientX - canvas.getBoundingClientRect().x;
    //CALCULATE i & j of the clicked SPACE
    let i = Math.floor(X / SPACE_SIZE);
    let getPosition = getId(i);
    // Prevent the player to play the same space twice
    if (gameData[getPosition.id]) return;
    // store the player's move to gameData and board
    if (getPosition.id != undefined) {
      gameData[getPosition.id] = currentPlayer;
      board[i][getPosition.position].val = currentPlayer;
      // draw the move on board
      drawOnBoard(currentPlayer, i, getPosition.position);
    }
    // Check if the play wins
    if (isWinner(board, currentPlayer)) {
      showGameOver(currentPlayer);
      return;
    }

    // check if it's a tie game
    if (isTie(gameData)) {
      showGameOver("tie");
      return;
    }

    if (OPPONENT == "computer") {
      // Get the id of the space using minimax algoritham
      let id = minimax(gameData, board, player.computer).id;
      console.log(id);

      //get i and j of space
      let space = getIJ(id);
      // draw the move on board
      // store the player's move to gameData and board
      if (getPosition.id != undefined) {
        gameData[id] = currentPlayer;
        board[space.i][space.j].val = currentPlayer;
        // draw the move on board
        drawOnBoard(player.computer, space.i, space.j);
      }

      // Check if the play wins
      if (isWinner(board, currentPlayer)) {
        showGameOver(currentPlayer);
        return;
      }
      // check if it's a tie game
      if (isTie(gameData)) {
        showGameOver("tie");
        return;
      }
    } else {
      // GIVE TURN TO THE OTHER PLAYER
      currentPlayer = currentPlayer == player.man ? player.friend : player.man;
    }
  });

  //MINIMAX
  function minimax(gameData, board, PLAYER) {
    // console.log(board);
    // BASE
    if (isWinner(board, player.computer)) return { evaluation: +10 };
    if (isWinner(board, player.man)) return { evaluation: -10 };
    if (isTie(gameData)) return { evaluation: 0 };
    //LOOK for EMPTY SPACES
    let EMPTY_SPACES = emptySpaces(board);
    //SAVE ALL MOVES AND THEIR EVALUATIONS
    let moves = [];
    // console.log(EMPTY_SPACES);
    // console.log(PLAYER);
    // LOOP OVER TH E EMPITY SPACES
    for (let i = 0; i < EMPTY_SPACES.length; i++) {
      console.log(EMPTY_SPACES.length);
      //GET ID OF EMPTY SPACE
      let id = EMPTY_SPACES[i].id;
      // console.log(id);
      let space = getIJ(id);
      // console.log(space);
      //BACK UP THE SPACE
      let backup = gameData[id];
      let backup2 = board[space.i][space.j].val;
      //MAKE THE MOVE FOR THE PLAYER
      gameData[id] = PLAYER;
      board[space.i][space.j].val = PLAYER;
      //SAVE THE MOVES'S ID AND EVALUATION
      let move = {};
      move.id = id;
      // console.log(move);
      // console.log(backup);
      // console.log(backup2);

      //THE MOVE EVALUATION
      if (PLAYER == player.computer) {
        console.log("SS", board);
        move.evaluation = minimax(gameData, board, player.man).evaluation;
        // console.log(move);
      } else {
        move.evaluation = minimax(gameData, board, player.computer).evaluation;
        // console.log(move);
      }
      // console.log(move.evaluation);
      //RESTORE SPACE
      gameData[id] = backup;
      board[space.i][space.j].val = backup2;
      // //SAVE MOVED TO MOVES ARRAY
      moves.push(move);
    }
    console.log(moves);
    //MINIMAX ALGIRITHM
    // let bestMove;
    // if (PLAYER == player.computer) {
    //   let bestEvaluation = -Infinity;
    //   for (let i = 0; i < moves.length; i++) {
    //     if (moves[i].evaluation > bestEvaluation) {
    //       bestEvaluation = moves[i].evaluation;
    //       bestMove = moves[i];
    //     }
    //   }
    // } else {
    //   let bestEvaluation = +Infinity;
    //   for (let i = 0; i < moves.length; i++) {
    //     if (moves[i].evaluation < bestEvaluation) {
    //       bestEvaluation = moves[i].evaluation;
    //       bestMove = moves[i];
    //     }
    //   }
    // }
    // // console.log(bestMove);
    // return bestMove;
  }
  // draw on board
  function drawOnBoard(player, i, j) {
    let img = player == "X" ? xImage : oImage;
    // the x,y positon of the image are the x,y of the clicked space
    ctx.drawImage(img, i * SPACE_SIZE, j * SPACE_SIZE);
  }
  function emptySpaces(board) {
    let EMPTY = [];
    for (let i = 0; i < board.length; i++) {
      let selectableArray = board[i].filter((x) => !x.val);
      if (selectableArray.length > 0) {
        EMPTY.push(selectableArray[selectableArray.length - 1]);
      }
    }
    return EMPTY.filter((x) => !x.val);
  }
  function getId(val) {
    let selectedArray = MATCH_COMBO[val];
    let selectableArray = [];
    for (let i = 0; i < selectedArray.length; i++) {
      if (!gameData[selectedArray[i]]) {
        selectableArray.push(selectedArray[i]);
      }
    }
    return {
      id: selectableArray[selectableArray.length - 1],
      position: selectableArray.length - 1,
    };
  }

  //Get I and J
  function getIJ(id) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].id == id) {
          return {
            i: i,
            j: j,
          };
        }
      }
    }
  }

  function isWinner(board, player) {
    // verticalCheck & horizontalCheck;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          board[j][i].val == player &&
          board[j][i + 1].val == player &&
          board[j][i + 2].val == player &&
          board[j][i + 3].val == player
        ) {
          return true;
        }
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          board[i][j].val == player &&
          board[i + 1][j].val == player &&
          board[i + 2][j].val == player &&
          board[i + 3][j].val == player
        ) {
          return true;
        }
      }
    }
    //crossCheckFromLeft & crossCheckFromRight
    for (let i = 3; i < 7; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          board[i][j].val == player &&
          board[i - 1][j + 1].val == player &&
          board[i - 2][j + 2].val == player &&
          board[i - 3][j + 3].val == player
        ) {
          return true;
        }
      }
    }
    for (let i = 3; i < 7; i++) {
      for (let j = 3; j < 7; j++) {
        if (
          board[i][j].val == player &&
          board[i - 1][j - 1].val == player &&
          board[i - 2][j - 2].val == player &&
          board[i - 3][j - 3].val == player
        ) {
          return true;
        }
      }
    }
  }

  function isTie(gameData) {
    let isBoardFill = true;
    for (let i = 0; i < gameData.length; i++) {
      isBoardFill = gameData[i] && isBoardFill;
    }
    if (isBoardFill) {
      return true;
    }
    return false;
  }

  // SHOW GAME OVER
  function showGameOver(player) {
    let message = player == "tie" ? "Oops No Winner" : "The Winner is";
    let imgSrc = `img/${player}.png`;

    gameOverElement.innerHTML = `
              <h1>${message}</h1>
              <img class="winner-img" src=${imgSrc}> </img>
              <div class="play" onclick="location.reload()">Play Again!</div>
          `;

    gameOverElement.classList.remove("hide");
  }
}
