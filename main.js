const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const boardSize = canvas.width = canvas.height = 400;

const appleColor = '#ff4d4d';

let snake = [];
let apple = {};
let direction = {};
let score = 0;
let gameInterval;

const init = () => {
  snake = [{ x: 10, y: 10 }];
  apple = generateRandomApple();
  direction = { x: 1, y: 0 };
  score = 0;
  updateScoreDisplay(score);
  hideGameOverScreen();
  gameInterval = setInterval(gameLoop, 200);
};

const generateRandomApple = () => ({
  x: Math.floor(Math.random() * (boardSize / gridSize)),
  y: Math.floor(Math.random() * (boardSize / gridSize)),
});

const updateScoreDisplay = (score) => {
  document.querySelector('.score').textContent = `Score: ${score}`;
};

const hideGameOverScreen = () => {
  document.querySelector('.game-over').style.display = 'none';
};

const draw = () => {
  ctx.clearRect(0, 0, boardSize, boardSize);

  // Draw snake
  snake.forEach(({ x, y }, index) => {
    // Calculate the shade of green progressively darker for each segment
    const segmentShade = 100 + (155 * (index / snake.length));
    ctx.fillStyle = `rgb(0, ${segmentShade}, 0)`;

    // Apply border-radius for rounded corners
    ctx.beginPath();
    ctx.roundRect(x * gridSize, y * gridSize, gridSize, gridSize, gridSize * 0.3); // 30% border radius
    ctx.fill();
  });

  // Draw apple
  ctx.fillStyle = appleColor;
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'red';
  ctx.beginPath();
  ctx.arc(apple.x * gridSize + gridSize / 2, apple.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Update score display
  updateScoreDisplay(score);
};

const update = () => {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap the snake around the screen
  head.x = head.x < 0 ? (boardSize / gridSize) - 1 : head.x >= boardSize / gridSize ? 0 : head.x;
  head.y = head.y < 0 ? (boardSize / gridSize) - 1 : head.y >= boardSize / gridSize ? 0 : head.y;

  // Check if the snake eats the apple
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    apple = generateRandomApple();
  } else {
    snake.pop();
  }

  // Insert the new head at the beginning of the snake
  snake.unshift(head);

  // Check for collision with itself
  if (isCollision(head)) {
    clearInterval(gameInterval);
    showGameOverScreen();
  }
};

const isCollision = (head) => snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

const showGameOverScreen = () => {
  document.querySelector('.game-over').style.display = 'block';
  document.getElementById('finalScore').textContent = score;
};

const gameLoop = () => {
  update();
  draw();
};

// Control snake with arrow keys
document.addEventListener('keydown', ({ key }) => {
  const directionMapping = {
    ArrowRight: { x: 1, y: 0 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
  };

  if (directionMapping[key] && !(direction.x === -directionMapping[key].x || direction.y === -directionMapping[key].y)) {
    direction = directionMapping[key];
  }
});

// Mobile controls (arrow buttons)
['upBtn', 'leftBtn', 'downBtn', 'rightBtn'].forEach((btnId, i) => {
  document.getElementById(btnId)?.addEventListener('click', () => {
    const directions = [
      { x: 0, y: -1 }, // up
      { x: -1, y: 0 }, // left
      { x: 0, y: 1 },  // down
      { x: 1, y: 0 },  // right
    ];
    const newDirection = directions[i];
    if (!(direction.x === -newDirection.x || direction.y === -newDirection.y)) {
      direction = newDirection;
    }
  });
});

// Restart the game
document.getElementById('restartBtn')?.addEventListener('click', init);

// Start the game initially
init();
