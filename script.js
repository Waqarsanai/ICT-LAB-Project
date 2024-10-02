const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const boardSize = canvas.width = canvas.height = 400;
const snakeColorGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
snakeColorGradient.addColorStop(0, '#0a0');
snakeColorGradient.addColorStop(1, '#0f0');

const appleColor = '#ff4d4d';

let snake;
let apple;
let direction;
let score;
let gameInterval;

function init() {
  snake = [{ x: 10, y: 10 }];
  apple = { x: Math.floor(Math.random() * (boardSize / gridSize)), y: Math.floor(Math.random() * (boardSize / gridSize)) };
  direction = { x: 1, y: 0 };
  score = 0;
  document.querySelector('.score').textContent = `Score: ${score}`;
  document.querySelector('.game-over').style.display = 'none';
  gameInterval = setInterval(gameLoop, 200);
}

function draw() {
  ctx.clearRect(0, 0, boardSize, boardSize);

  // Draw snake
  ctx.fillStyle = snakeColorGradient;
  snake.forEach(({ x, y }) => ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize));

  // Draw apple as a circle with shadow
  ctx.fillStyle = appleColor;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "red";
  ctx.beginPath();
  ctx.arc(apple.x * gridSize + gridSize / 2, apple.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Update score display
  document.querySelector('.score').textContent = `Score: ${score}`;
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap the snake around the screen when it hits a wall
  if (head.x < 0) head.x = (boardSize / gridSize) - 1;
  if (head.x >= boardSize / gridSize) head.x = 0;
  if (head.y < 0) head.y = (boardSize / gridSize) - 1;
  if (head.y >= boardSize / gridSize) head.y = 0;

  // Check if the snake eats the apple
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    apple = { x: Math.floor(Math.random() * (boardSize / gridSize)), y: Math.floor(Math.random() * (boardSize / gridSize)) };
  } else {
    snake.pop();
  }

  // Insert the new head at the beginning of the snake
  snake.unshift(head);

  // Check for collision with itself
  if (checkCollision(head)) {
    clearInterval(gameInterval);
    document.querySelector('.game-over').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
  }
}

function checkCollision({ x, y }) {
  // Check for collision with itself
  return snake.slice(1).some(segment => segment.x === x && segment.y === y);
}

function gameLoop() {
  update();
  draw();
}

// Control snake with arrow keys
document.addEventListener('keydown', ({ key }) => {
  if (key === 'ArrowRight' && direction.x !== -1) direction = { x: 1, y: 0 };
  if (key === 'ArrowLeft' && direction.x !== 1) direction = { x: -1, y: 0 };
  if (key === 'ArrowUp' && direction.y !== 1) direction = { x: 0, y: -1 };
  if (key === 'ArrowDown' && direction.y !== -1) direction = { x: 0, y: 1 };
});

// Mobile controls (arrow buttons)
document.getElementById('upBtn').addEventListener('click', () => {
  if (direction.y !== 1) direction = { x: 0, y: -1 };
});

document.getElementById('leftBtn').addEventListener('click', () => {
  if (direction.x !== 1) direction = { x: -1, y: 0 };
});

document.getElementById('downBtn').addEventListener('click', () => {
  if (direction.y !== -1) direction = { x: 0, y: 1 };
});

document.getElementById('rightBtn').addEventListener('click', () => {
  if (direction
