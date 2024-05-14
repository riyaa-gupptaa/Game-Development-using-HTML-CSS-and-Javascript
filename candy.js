var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var row = 9;
var column = 9;
var score = 0;
var highestScore = localStorage.getItem("highestScore") || 0;
var gameDuration = 60; // Game duration in seconds
var gameTimeLeft = gameDuration; // Initialize game time left
var gameStarted = false; // Track if the game has started
var gameOver = false; // Track if the game is over
var currTile;
var otherTile;
let quitButton;
let scoreDisplay;
window.onload = function () {
    scoreDisplay = document.getElementById("score");
    startGame();
    startTimer();
    //1/10th of a second
    window.setInterval(function () {
        if (gameStarted && !gameOver) {
            crushCandy();
        }
    }, 100);
    quitButton = document.getElementById('quitButton');
    quitButton.addEventListener('click', () => {
        const confirmQuit = confirm('Are you sure you want to quit?');
        if (confirmQuit) {
            window.location.href = 'Front.html';
        }
    });
}
function startTimer() {
    var timer = setInterval(function () {
        if (gameTimeLeft <= 0) {
            clearInterval(timer);
            endGame();
        } else {
            gameTimeLeft--;
            document.getElementById("time").innerText = gameTimeLeft;
        }
    }, 1000);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}
function startGame() {
    // Initialize board with random candies
    for (let r = 0; r < row; r++) {
        let row = [];
        for (let c = 0; c < column; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./Images/" + randomCandy() + ".png";
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("dragend", dragEnd);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    // Shuffle candies until there are no initial matches
    while (checkValid()) {
        shuffleBoard();
    }

    console.log(board);
}

function shuffleBoard() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < column; c++) {
            board[r][c].src = "./Images/" + randomCandy() + ".png";
        }
    }
}

function dragStart() {
    if (gameOver) return;
    //this refers to tile that was clicked on for dragging
    currTile = this;
}
function dragOver(e) {
    e.preventDefault();
}
function dragEnter(e) {
    e.preventDefault();
}
function dragLeave() {

}
function dragDrop() {
    if (gameOver) return;
    //this refers to the target tile that was dropped on
    otherTile = this;
}
function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }
    let currCoords = currTile.id.split("-");//id="0-0" -> ["0","0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;

    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;
        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        } else {
            gameStarted = true; // Game has started after the first move
        }
    }
}
function crushCandy() {
    if (!gameOver) {
        crushThree();
        document.getElementById("score").innerText = score;
    }
}
function crushThree() {
    let candiesToRemove = []; // Store the candies to remove
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < column - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candiesToRemove.push(candy1, candy2, candy3);
            }
        }
    }
    for (let c = 0; c < column; c++) {
        for (let r = 0; r < row - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candiesToRemove.push(candy1, candy2, candy3);
            }
        }
    }

    // Remove matched candies and increase score
    if (candiesToRemove.length > 0) {
        score += candiesToRemove.length / 3; // Increase score for each set of matched candies
        for (let candy of candiesToRemove) {
            candy.src = "blank.png";
        }

        // Slide candies down
        slideCandy();

        // Generate new candies to fill empty spaces
        generateCandy();
    }
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem("highestScore", highestScore);
        console.log("New High Score:", highestScore); // Add this line
        document.getElementById("highScore").innerText = highestScore;
    }
    // Update the score display
    document.getElementById("score").innerText = score;
}



function slideCandy() {
    for (let c = 0; c < column; c++) {
        let ind = row - 1;
        for (let r = row - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "blank.png";
        }
    }
}
function checkValid() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < column - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    for (let c = 0; c < column; c++) {
        for (let r = 0; r < row - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}
function slideCandy() {
    for (let c = 0; c < column; c++) {
        let ind = row - 1;
        for (let r = row - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "blank.png";
        }
    }

    // Fill the top row with new candies
    for (let c = 0; c < column; c++) {
        if (board[0][c].src.endsWith("blank.png")) {
            board[0][c].src = "./Images/" + randomCandy() + ".png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < column; c++) {
        if (board[0][c].src.endsWith("blank.png")) {
            board[0][c].src = "./Images/" + randomCandy() + ".png";
        }
    }
}
function endGame() {
    gameOver = true;
    alert("Game Over! Your score: " + score);
}

