let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let gameStarted = false;
let startGameButton;
let quitButton;
let timerId;
let restartButton;
window.onload = function () {
  setGame();
  startGameButton = document.getElementById('startGameButton');
  startGameButton.addEventListener('click', startGame);
  quitButton = document.getElementById('quitButton');
  quitButton.addEventListener('click', () => {
    const confirmQuit = confirm('Are you sure you want to quit?');
    if (confirmQuit) {
      window.location.href = 'Front.html';
    }
  });
  restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', restartGame);
  displayHighestScore(); // Display the highest score when the game starts
};

function startGame() {
  resetGame();
  startGameButton.disabled = true; // Disable start button to prevent accidental restarts
  document.getElementById("message").innerText = "Get ready...";
  startGameCountdown(); // Start the countdown before setting up the game
}

function resetGame() {
  score = 0;
  gameOver = false;
  gameStarted = false;
  document.getElementById("score").innerText = "0";
  currMoleTile = null; // Reset currPlantTile to null
  currPlantTile = null; // Explicitly reset currPlantTile for restart
}

function startGameCountdown() {
  let countdown = 3;
  document.getElementById("message").innerText = `Get ready... ${countdown}`;

  timerId = setInterval(function () {
    countdown--;
    document.getElementById("message").innerText = `Get ready... ${countdown}`;

    if (countdown === 0) {
      clearInterval(timerId);
      setGame();
      gameStarted = true;
      document.getElementById("message").innerText = ""; // Clear countdown message
    }
  }, 1000); // Update countdown every second
}

function setGame() {
     // Clear the board before setting it up again
  document.getElementById("board").innerHTML = "";
  //set up the grid for the game board in html
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    document.getElementById("board").appendChild(tile);
  }
  setInterval(setMole, 2000); // 2000 milliseconds = 2 seconds
  setInterval(setPlant, 2000); // 2000 milliseconds = 2 second
}

function getRandomeTile() {
  let num = Math.floor(Math.random() * 9);
  return num.toString();
}

function setMole() {
  if (gameOver) {
    return;
  }
  if (currMoleTile) {
    currMoleTile.innerHTML = "";
  }
  let mole = document.createElement("img");
  mole.src = "monty-mole.png";
  let num = getRandomeTile();
  if (currPlantTile && currPlantTile.id == num) {
    return;
  }
  currMoleTile = document.getElementById(num);
  currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
      return;
    }
    if (currPlantTile) {
      currPlantTile.innerHTML = ""; // Clear existing plant image
    }
    let plant = document.createElement("img");
    plant.src = "piranha-plant.png";
    let num = getRandomeTile();
    while (currMoleTile && currMoleTile.id == num || document.getElementById(num).querySelector('img')) { // Check for mole and existing plant
      num = getRandomeTile();
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
  }
function selectTile() {
  if (gameOver || !gameStarted) {
    return;
  }
  if (this == currMoleTile) {
    score += 10;
    document.getElementById("score").innerText = score.toString(); // Update score
  } else if (this == currPlantTile) {
    document.getElementById("score").innerText = "Game Over: " + score.toString();
    gameOver = true;
  }
}

function restartGame() {
    let highestScore = localStorage.getItem("highestScore") || 0;
    if (score > highestScore) {
      highestScore = score;
      localStorage.setItem("highestScore", highestScore);
    }
    resetGame();
    displayHighestScore(); // Update the displayed highest score
    const startAgain = confirm("Game restarted. Do you want to start the game?");
    if (startAgain) {
      startGameCountdown();
    }
  }
  function displayHighestScore() {
    let highestScore = localStorage.getItem("highestScore") || 0;
    document.getElementById("highestScore").innerText = highestScore;
}
