const canvas = document.getElementById('gameCanvas');
const scoreDisplay = document.getElementById('score');
const ctx = canvas.getContext('2d');

let playerScore = 0;
let aiScore = 0;
const keys = {};

const paddleWidth = 12;
const paddleHeight = 100;
const paddleSpeed = 8;

const leftPaddle = {
  x: 20,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0
};

const rightPaddle = {
  x: canvas.width - 20 - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  dx: 5,
  dy: 5,
  speed: 5
};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  // Управление левой ракеткой
  if (keys['q'] || keys['Q']) {
    leftPaddle.y -= paddleSpeed;
  }

  if (keys['s'] || keys['S']) {
    leftPaddle.y += paddleSpeed;
  }

  // Управление правой ракеткой
  if (keys['ArrowUp']) {
    rightPaddle.y -= paddleSpeed;
  }

  if (keys['ArrowDown']) {
    rightPaddle.y += paddleSpeed;
  }

  // Ограничение ракеток в пределах поля
  leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
  rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));

  // Движение мяча
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Отскок от верхней и нижней стен
  if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
    ball.dy = -ball.dy;
  }

  // Отскок от ракеток
  if (
      ball.x - ball.size < leftPaddle.x + leftPaddle.width &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + leftPaddle.height &&
      ball.dx < 0
    ) {
      const hitPos = (ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (leftPaddle.height / 2);
      ball.dx = Math.abs(ball.dx);
      ball.dy = hitPos * ball.speed;
    }

  if (
      ball.x + ball.size > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + rightPaddle.height &&
      ball.dx > 0
    ) {
      const hitPos = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (rightPaddle.height / 2);
      ball.dx = -Math.abs(ball.dx);
      ball.dy = hitPos * ball.speed;
    }

    // Гол
  if (ball.x < 0) {
    aiScore++;
    resetBall();
  } else if (ball.x > canvas.width) {
    playerScore++;
    resetBall();
  }

  updateScore();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
  ball.dy = (Math.random() * 2 - 1) * ball.speed;
}

function updateScore() {
  scoreDisplay.textContent = `${playerScore} : ${aiScore}`;
}


function draw() {
  // Очистка
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Центральная пунктирная линия
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = '#333';
  ctx.stroke();
  ctx.setLineDash([]);

  // Ракетки
  ctx.fillStyle = '#000';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
  
  // Мяч
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();
}

// Игра
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();