const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('scoreDisplay');

let bird, pipes, frame, score, gameStarted = false, gameOver = false;
let flySound, scoreSound, gameOverSound;

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function loadSounds() {
  flySound = new Audio('sounds/fly.wav');
  scoreSound = new Audio('sounds/score.wav');
  gameOverSound = new Audio('sounds/gameover.wav');
}

function initGame() {
  bird = {
    x: 100,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.15,
    lift: -4.5
  };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  scoreDisplay.textContent = 'Score: 0';
  restartBtn.style.display = 'none';
}

function drawBird() {
  const gradient = ctx.createRadialGradient(
    bird.x + bird.width / 2, bird.y + bird.height / 2, 5,
    bird.x + bird.width / 2, bird.y + bird.height / 2, 20
  );
  gradient.addColorStop(0, "#ffeb3b");
  gradient.addColorStop(1, "#f57f17");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(bird.x + bird.width/2, bird.y + bird.height/2, 15, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.stroke();
}

function drawPipe(pipe) {
  ctx.fillStyle = "#388e3c";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

  ctx.fillStyle = "#66bb6a";
  ctx.fillRect(pipe.x + pipe.width - 5, 0, 5, pipe.top);
  ctx.fillRect(pipe.x + pipe.width - 5, pipe.bottom, 5, canvas.height - pipe.bottom);
}

function update() {
  if (!gameStarted || gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 100 === 0) {
    const topHeight = Math.random() * (canvas.height/2) + 50;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: topHeight,
      bottom: topHeight + 140
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2.5;

    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      if(scoreSound) scoreSound.play();
    }

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
      if(gameOverSound) gameOverSound.play();
      restartBtn.style.display = 'inline-block';
    }
  });

  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
  }

  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  pipes.forEach(drawPipe);

  if (gameOver) {
    ctx.fillStyle = "#e53935";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
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
  if(flySound) flySound.play();
}

function restartGame() {
  gameStarted = true;
  initGame();
  gameLoop();
}

function fly() {
  if (!gameStarted || gameOver) return;
  bird.velocity = bird.lift;
  if(flySound) flySound.play();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

window.addEventListener('keydown', e => {
  if (e.code === "ArrowUp" || e.code === "Space") {
    fly();
  }
});

window.addEventListener('mousedown', fly);
window.addEventListener('touchstart', fly);

loadSounds();
