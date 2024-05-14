let startButton;
let countdown = 3;
let countdownInterval;
let board;
let boardwidth = 360;
let boardheight = 940;
let context;
let quitButton;
let birdwidth = 34; //width/height ratio=408/228=17/12
let birdheight = 24;
let birdX = boardwidth / 8;
let birdY = boardheight / 2;
let birdimg;
let bird = { //Object of bird
    x: birdX,
    y: birdY,
    width: birdwidth,
    height: birdheight
}
//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio=384/30721=1/8;
let pipeheight = 512; // Reduced pipe height
let pipeX = boardwidth;
let pipeY = 0;
let topPipeimg;
let bottomPipeimg;

//Physics
let velocityx = -2; // Reduced bird speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let gameStarted = false; // Variable to track if the game has started
window.onload = function () {
    startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); //used for drawing on the board
    quitButton = document.getElementById('quitButton');
    quitButton.addEventListener('click', () => {
        const confirmQuit = confirm('Are you sure you want to quit?');
        if (confirmQuit) {
            window.location.href = 'Front.html';
        }
    });

    //Load images
    birdimg = new Image();
    birdimg.src = "flappybird.png";
    birdimg.onload = function () {
        // Place initial pipes before starting the game
        placePipes();
        requestAnimationFrame(update); // Start the game loop
        setInterval(placePipes, 1500); //every 1.5seconds
    }

    topPipeimg = new Image();
    topPipeimg.src = "toppipe.png";

    bottomPipeimg = new Image();
    bottomPipeimg.src = "bottompipe.png";

    document.addEventListener("keydown", moveBird);
}

function startGame() {
    startButton.style.display = 'none'; // Hide the start button
    countdown = 3; // Reset countdown
    updateCountdown(); // Display the initial countdown
    countdownInterval = setInterval(updateCountdown, 1000); // Start countdown
}

function updateCountdown() {
    if (countdown > 0) {
        context.clearRect(0, 0, board.width, board.height);
        context.fillStyle = 'white';
        context.font = '60px sans-serif';
        context.fillText(countdown, board.width / 2 - 20, board.height / 2);
        countdown--;
    } else {
        clearInterval(countdownInterval); // Stop the countdown
    }
}

function update() {
    if (!gameOver && countdown == 0) { // Check if the game has started
        context.clearRect(0, 0, board.width, board.height);
        //bird
        velocityY += gravity;
        bird.y = Math.max(bird.y + velocityY, 0);
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
        if (bird.y > board.height) {
            gameOver = true;
        }
        //pipes
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityx;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 1;
                pipe.passed = true;
            }
            if (detectCollision(bird, pipeArray[i])) {
                gameOver = true;
            }
        }
        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift();
        }
        updateHighScore();
        //score
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);
        context.fillStyle = "white";
        context.font = "27px sans-serif";
        context.fillText("High Score: " + highScore, board.width - 200, 45);
    }

    if (gameOver) {
        context.fillStyle = "white";
        context.font = "25px sans-serif";
        context.fillText("GAME OVER", 5, 90);
        context.fillText("Up arrow key to start again", 5, 140); // Display restart instructions
    }

    requestAnimationFrame(update);
}

function placePipes() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeheight / 4 - Math.random() * (pipeheight / 2); // Adjusted randomPipeY calculation
    let openingSpace = board.height /4+40;
    let topPipe = {
        img: topPipeimg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeheight,
        passed: false,

    }
    pipeArray.push(topPipe);
    let bottomPipe = {
        img: bottomPipeimg,
        x: pipeX,
        y: randomPipeY + pipeheight + openingSpace,
        width: pipeWidth,
        height: pipeheight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}



function moveBird(e) {
    if (e.code == "space" || e.code == "ArrowUp" || e.code == "KeyX") {
        if (!gameOver && countdown == 0) { // Check if the game has started and the countdown is finished
            velocityY = -6;
        }
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyBirdHighScore', highScore);
    }
}