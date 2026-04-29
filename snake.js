const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const boxSize = 20;
const gameSpeed = 100;

let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction = "RIGHT";
let score = 0;

const scoreDisplay = document.getElementById("score");

let game;
let isPaused = false;
let pauseTriggered = false; // 🔥 empêche boucle infinie

function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, boxSize, boxSize);
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (height / boxSize)) * boxSize,
  };
}

let food = spawnFood();

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


function collisionWithBody(head, body) {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

function drawCenteredMultilineText(text, maxWidth, lineHeight) {
  const words = text.split(" ");
  let lines = [];
  let line = "";

  // Découpe du texte en lignes
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

  // Calcul du point de départ pour centrage vertical
  const totalHeight = lines.length * lineHeight;
  let startY = (height - totalHeight) / 2;

  // Texte centré horizontalement
  ctx.textAlign = "center";

  lines.forEach((l, i) => {
    ctx.fillText(l, width / 2, startY + i * lineHeight);
  });

  // Reset sécurité
  ctx.textAlign = "start";
}

function pauseGame() {
  isPaused = true;
  clearInterval(game);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";

  const message =
    "Félicitations ! Pour récompenser vos efforts voilà le mot secret : SECRET (et oui, tout simplement). " +
    "Dites-le aux bibliothécaires et ils vous donneront vos deux morceaux de carte en récompense. " +
    "Bravo à vous jeune pirate, et bon courage pour la suite de vos aventures !";

  const maxWidth = width * 0.8; // 80% du canvas
  const lineHeight = 24;

  drawCenteredMultilineText(message, maxWidth, lineHeight);

  setTimeout(() => {
    isPaused = false;
    game = setInterval(drawGame, gameSpeed);
  }, 10000);
}

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

  // 🍎 Manger la nourriture
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = `Score : ${score}`;
    food = spawnFood();

    // 🔥 Déclenche la pause UNE SEULE FOIS
    if (score === 5 && !pauseTriggered) {
      pauseTriggered = true;
      pauseGame();
      return; // important !
    }

  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // Collision mur
  if (
    snakeX < 0 ||
    snakeX >= width ||
    snakeY < 0 ||
    snakeY >= height
  ) {
    clearInterval(game);
    alert(`Game Over ! Score : ${score}`);
    initGame();
    return;
  }

  // Collision corps
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

function initGame() {
  snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
  direction = "RIGHT";
  score = 0;
  pauseTriggered = false;
  scoreDisplay.textContent = `Score : ${score}`;
  food = spawnFood();

  clearInterval(game);
  game = setInterval(drawGame, gameSpeed);
}

game = setInterval(drawGame, gameSpeed);