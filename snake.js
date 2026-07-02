fetch ("https://script.google.com/macros/s/AKfycbzn5hSQhUa_e39Q0npxRaVdy7vuwz4_6MS4-QzAoDLrfpwfbeBHWWjqheDYZTtZ7Sgp/exec?event=open"); 
       
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let boxSize = 20;      // sera recalculé
let width;
let height;
const gridSize = 20;   // nombre de cases
const gameSpeed = 160;

let snake;
let direction = "RIGHT";
let score = 0;
const scoreDisplay = document.getElementById("score");

let game;
let isPaused = false;
let pauseTriggered = false;

// ✅ Rend le canvas responsive
function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.9, 500);

  canvas.width = size;
  canvas.height = size;

  width = canvas.width;
  height = canvas.height;

  boxSize = width / gridSize;
}

// ✅ Dessin case
function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, boxSize, boxSize);
}

// ✅ Génération nourriture
function spawnFood() {
  return {
    x: Math.floor(Math.random() * gridSize) * boxSize,
    y: Math.floor(Math.random() * gridSize) * boxSize,
  };
}

let food;

// ✅ Contrôles clavier
document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  e.preventDefault();

  if (e.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (e.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (e.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  } else if (e.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  }
}

// ✅ Collision corps
function collisionWithBody(head, body) {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

// ✅ Texte centré
function drawCenteredMultilineText(text, maxWidth, lineHeight) {
  const words = text.split(" ");
  let lines = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  lines.push(line);

  const totalHeight = lines.length * lineHeight;
  let startY = (height - totalHeight) / 2;

  ctx.textAlign = "center";
  lines.forEach((l, i) => {
    ctx.fillText(l, width / 2, startY + i * lineHeight);
  });
  ctx.textAlign = "start";
}

// ✅ Pause avec texte responsive
function pauseGame() {
  isPaused = true;
  clearInterval(game);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "white";
  ctx.font = `${Math.max(14, width / 25)}px Arial`;

  const message =
    "Félicitations ! Pour récompenser vos efforts voilà le mot secret : SECRET (et oui, tout simplement). " +
    "Dites-le aux bibliothécaires et ils vous donneront votre morceau de page en récompense. " +
    "Bravo à vous jeune pirate, et bon courage pour la suite de vos aventures !";

  const maxWidth = width * 0.8;
  const lineHeight = width / 20;

  drawCenteredMultilineText(message, maxWidth, lineHeight);

  
setTimeout(() => {
      window.location.href = "https://mediatheques.toulon.fr/";
  }, 60000);
       }



// ✅ Boucle de jeu
function drawGame() {
  if (isPaused) return;

  ctx.clearRect(0, 0, width, height);

  drawBox(food.x, food.y, "red");

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= boxSize;
  if (direction === "RIGHT") snakeX += boxSize;
  if (direction === "UP") snakeY -= boxSize;
  if (direction === "DOWN") snakeY += boxSize;

  // 🍎 Mange
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = `Score : ${score}`;
    food = spawnFood();

    if (score === 5 && !pauseTriggered) {
      pauseTriggered = true;
      pauseGame();
      return;
    }
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // ✅ Collision murs (responsive)
  if (
    snakeX < 0 ||
    snakeX >= width ||
    snakeY < 0 ||
    snakeY >= height
  ) {
    clearInterval(game);
    alert(`Game Over ! Score : ${score} Pour rejouer, cliquez sur OK !`);
    initGame();
    return;
  }

  // ✅ Collision corps
  if (collisionWithBody(newHead, snake)) {
    clearInterval(game);
    alert(`Game Over ! Score : ${score}`);
    initGame();
    return;
  }

  snake.unshift(newHead);

  snake.forEach((segment, i) => {
    drawBox(segment.x, segment.y, i === 0 ? "lime" : "green");
  });
}

// ✅ Initialisation
function initGame() {
  resizeCanvas();

  snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
  direction = "RIGHT";
  score = 0;
  pauseTriggered = false;

  scoreDisplay.textContent = `Score : ${score}`;
  food = spawnFood();

  clearInterval(game);
  game = setInterval(drawGame, gameSpeed);
}

// ✅ Resize en direct
window.addEventListener("resize", resizeCanvas);

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, false);

canvas.addEventListener("touchend", function (e) {
  const touch = e.changedTouches[0];
  let touchEndX = touch.clientX;
  let touchEndY = touch.clientY;

  handleSwipe(touchEndX, touchEndY);
}, false);

fetch ("https://script.google.com/macros/s/AKfycbzn5hSQhUa_e39Q0npxRaVdy7vuwz4_6MS4-QzAoDLrfpwfbeBHWWjqheDYZTtZ7Sgp/exec?event=play"); 

function handleSwipe(endX, endY) {
  let dx = endX - touchStartX;
  let dy = endY - touchStartY;

  // seuil minimum pour éviter les petits gestes involontaires
  const minSwipeDistance = 30;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > minSwipeDistance) {
      if (dx > 0 && direction !== "LEFT") {
        direction = "RIGHT";
      } else if (dx < 0 && direction !== "RIGHT") {
        direction = "LEFT";
      }
    }
  } else {
    if (Math.abs(dy) > minSwipeDistance) {
      if (dy > 0 && direction !== "UP") {
        direction = "DOWN";
      } else if (dy < 0 && direction !== "DOWN") {
        direction = "UP";
      }
    }
  }
}

document.getElementById("up").addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});

document.getElementById("down").addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});

document.getElementById("left").addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});

document.getElementById("right").addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

// ✅ Lancement
initGame();
resizeCanvas(); // OBLIGATOIRE

