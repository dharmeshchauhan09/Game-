const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('scoreDisplay');

let bird, pipes, frame, score;
let gameStarted = false;
let isGameOver = false;
let movingUp = false;
let movingDown = false;

function initGame() {
  bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    velocity: 0,
    speed: 0.8,
    maxSpeed: 8,
    minSpeed: -8
  };
  pipes = [];
  frame = 0;
  score = 0;
  isGameOver = false;
  scoreDisplay.textContent = `Score: 0`;
}

function drawBird() {
  // 3D look for bird
  const gradient = ctx.createRadialGradient(
    bird.x + bird.width / 2, bird.y + bird.height / 2, 5,
    bird.x + bird.width / 2, bird.y + bird.height / 2, 20
  );
  gradient.addColorStop(0, "gold");
  gradient.addColorStop(1, "orange");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(bird.x + bird.width / 2, bird.y + bird.height / 2, 15, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

  // Add a light 3D shine effect
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(pipe.x + pipe.width - 5, 0, 5, pipe.top);
  ctx.fillRect(pipe.x + pipe.width - 5, pipe.bottom, 5, canvas.height - pipe.bottom);
}

function update() {
  if (isGameOver || !gameStarted) return;

  if (movingUp && bird.velocity > bird.minSpeed) {
    bird.velocity -= bird.speed;
  } else if (movingDown && bird.velocity < bird.maxSpeed) {
    bird.velocity += bird.speed;
  } else {
    bird.velocity += 0.2; // Gravity
  }

  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height) bird.y = canvas.height - bird.height;
  if (bird.y < 0) bird.y = 0;

  if (frame % 90 === 0) {
    let top = Math.random() * 150 + 50;
    pipes.push({
      x: canvas.width,
      width: 40,
      top: top,
      bottom: top + 100
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      isGameOver = true;
    }
  });

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  pipes.forEach(drawPipe);

  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "26px Arial";
    ctx.fillText("Game Over!", 80, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function jump() {
  if (!gameStarted) return;
  movingUp = true;
}

function stopJump() {
  movingUp = false;
}

function moveDown() {
  if (!gameStarted) return;
  movingDown = true;
}

function stopMoveDown() {
  movingDown = false;
}

function startGame() {
  gameStarted = true;
  isGameOver = false;
  initGame();
  gameLoop();
}

startBtn.addEventListener("click", startGame);

window.addEventListener("mousedown", jump);
window.addEventListener("touchstart", jump);

window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowUp" || e.code === "Space") jump();
  else if (e.code === "ArrowDown") moveDown();
});

window.addEventListener("keyup", function (e) {
  if (e.code === "ArrowUp" || e.code === "Space") stopJump();
  else if (e.code === "ArrowDown") stopMoveDown();
});
