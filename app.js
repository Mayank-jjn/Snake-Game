// Select elements
const board = document.querySelector('#board');
const scoreBox = document.querySelector('#scoreBox');
const highscoreBox = document.querySelector('#highscoreBox');

// Game variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('Music/food.mp3');
const gameOverSound = new Audio('Music/Game-Over.mp3');

let speed = 18;
let lastPaintTime = 0;
let score = 0;

// High score from local storage
let highScore = localStorage.getItem('highScore') || 0;
highscoreBox.innerHTML = "Hi Score : " + highScore;

// Snake and food positions
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Game state
let isGameOver = false;

// Main game loop
function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;

    lastPaintTime = ctime;
    gameEngine();
}

// Check collision with wall or itself
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0;
}

// Reset the game state after game over
function resetGame() {
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Score : " + score;
    isGameOver = false;
}

// Play sound without overlap
function playSound(audio) {
    audio.pause();
    audio.currentTime = 2;
    audio.play();
}

// Game engine logic
function gameEngine() {
    if (isCollide(snakeArr)) {
        if (!isGameOver) {
            isGameOver = true;
            playSound(gameOverSound); // Play sound immediately on game over
            setTimeout(() => {
                alert("Game Over. Press any key to play again!");
            }, 100);
        }
        return;
    }

    // Snake eats the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        playSound(foodSound);
        score++;
        scoreBox.innerHTML = "Score : " + score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highscoreBox.innerHTML = "Hi Score : " + highScore;
        }

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        food = {
            x: Math.floor(2 + (16 - 2 + 1) * Math.random()),
            y: Math.floor(2 + (16 - 2 + 1) * Math.random())
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Clear board and redraw snake and food
    board.innerHTML = "";

    snakeArr.forEach((e, index) => {
        const element = document.createElement('div');
        element.style.gridRowStart = e.y;
        element.style.gridColumnStart = e.x;
        element.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(element);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Start the game loop
window.requestAnimationFrame(main);

// Handle key presses
window.addEventListener('keydown', e => {
    // Stop game over sound when key is pressed
    if (!gameOverSound.paused) {
        gameOverSound.pause();
        gameOverSound.currentTime = 2;
    }

    // Restart game after game over
    if (isGameOver) {
        resetGame();
        return;
    }

    // Change direction based on key
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});
