
// 1: Get all the elements
var moveSound = new Audio ();
moveSound.src = "music/music_move.mp3";
var foodSound = new Audio ();
foodSound.src = "music/music_food.mp3";
var gameOverSound = new Audio ();
gameOverSound.src = "music/music_gameover.mp3";

var board = document.querySelector(".board");
var highestScore = document.querySelector(".highest-score");
var score = document.querySelector(".score");

// Step 2 Variable Initialization
var snake = [{ x: 10, y: 10 }];
var direction = { x: 0, y: 0 };

var food = foodRandomPosition();
var currentScore = 0;
var hScore = localStorage.getItem("highest-score");
score.innerHTML = `Score ${currentScore}`;

if (hScore) {
  highestScore.innerHTML = `Highest Score: ${hScore}`;
} else {
  highestScore.innerHTML = `Highest Score: 0`;
}

window.addEventListener("keydown", function (e) {
  const key = e.key;
  let newDirection;
  if (key === "ArrowUp") {
    moveSound.play();
    newDirection = { x: 0, y: -1 };
  } else if (key === "ArrowDown") {
    moveSound.play();
    newDirection = { x: 0, y: 1 };
  } else if (key === "ArrowLeft") {
    moveSound.play();
    newDirection = { x: -1, y: 0 };
  } else if (key === "ArrowRight") {
    moveSound.play();
    newDirection = { x: 1, y: 0 };
  }

  // If NewDirection valid hun then direction ko update kar dena
  if (
    newDirection &&
    (newDirection.x !== -direction.x || newDirection.y !== -direction.y)
  ) {
    direction = newDirection;
  }
});

function foodRandomPosition() {
  var xPosition = Math.floor(Math.random() * 18 + 1);
  var yPosition = Math.floor(Math.random() * 18 + 1);
  return {
    x: xPosition,
    y: yPosition,
  };
}

// Draw Elements
function drawElement(position, className) {
  // Position would be an object always
  var element = document.createElement("div");
  element.style.gridRowStart = position.y;
  element.style.gridColumnStart = position.x;
  element.classList.add(className);
  board.appendChild(element);
}

function drawGame() {
  board.innerHTML = "";
  drawElement(food, "food");

  for (var i = 0; i < snake.length; i++) {
    var item = snake[i];
    if (i === 0) {
      drawElement(item, "head");
    } else {
      drawElement(item, "tail");
    }
  }
}

function moveSnake() {
  var newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(newHead);

  // If Food eaten
  if (newHead.x === food.x && newHead.y === food.y) {
    foodSound.play();
    updateScore();
    food = foodRandomPosition();
  } else {
    snake.pop();
  }
}

function resetGame() {
  gameOverSound.play();
  Swal.fire({
    icon: "warning",
    title: "Game  Over!",
    text: "Try Again",
    timer: 4000,
  });
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = foodRandomPosition();
  console.log(hScore);
  var currentHighestScore = localStorage.getItem("highest-score") || 0;
  if (currentScore > currentHighestScore) {
    localStorage.setItem("highest-score", hScore);
  }

  currentScore = 0;
  // For Current Score
  score.innerHTML = `Score ${currentScore}`;
}

function checkGameOver() {
  var head = snake[0];

  // If Snake collide to wall
  if (head.x < 1 || head.x > 18 || head.y < 1 || head.y > 18) {
    return resetGame();
  }

  // If Snake collide to itself
  for (var i = 1; i < snake.length; i++) {
    var item = snake[i];
    if (head.x === item.x && head.y === item.y) {
      return resetGame();
    }
  }
}

function updateScore() {
  currentScore++;

  // For Current Score
  score.innerHTML = `Score ${currentScore}`;

  // For Highest Score
  if (currentScore > hScore) {
    hScore = currentScore;
    highestScore.innerHTML = `Highest Score: ${hScore}`;
  }
}

setInterval(function () {
  drawGame();
  checkGameOver();
  moveSnake();
}, 200);