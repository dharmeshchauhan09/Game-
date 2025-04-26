const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('scoreDisplay');

let bird, pipes, frame, score, gameStarted = false, gameOver = false;

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.7;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function initGame() {
  bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    lift: -10
  };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  scoreDisplay.textContent = 'Score: 0';
}

function drawBird() {
  const gradient = ctx.createRadialGradient(
    bird.x + bird.width/2, bird.y + bird.height/2, 5,
    bird.x + bird.width/2, bird.y + bird.height/2, 20
  );
  gradient.addColorStop(0, "gold");
  gradient.addColorStop(1, "orange");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(bird.x + bird.width/2, bird.y + bird.height/2, 15, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

  ctx.fillStyle = "lightgreen";
  ctx.fillRect(pipe.x + pipe.width - 5, 0, 5, pipe.top);
  ctx.fillRect(pipe.x + pipe.width - 5, pipe.bottom, 5, canvas.height - pipe.bottom);
}

function update() {
  if (!gameStarted || gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 90 === 0) {
    const topHeight = Math.random() * (canvas.height/2) + 50;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: topHeight,
      bottom: topHeight + 120
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 3;

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
      gameOver = true;
    }
  });

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  pipes.forEach(drawPipe);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", canvas.width/2 - 80, canvas.height/2);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

function startGame() {
  gameStarted = true;
  initGame();
  gameLoop();
}

// Controls
function fly() {
  if (!gameStarted) return;
  bird.velocity = bird.lift;
}

startBtn.addEventListener('click', startGame);

// Desktop
window.addEventListener('keydown', e => {
  if (e.code === "Space" || e.code === "ArrowUp") fly();
});
window.addEventListener('mousedown', fly);

// Mobile
window.addEventListener('touchstart', fly);
