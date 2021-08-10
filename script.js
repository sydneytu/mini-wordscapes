document.addEventListener("DOMContentLoaded", function () {
  const userInput = document.getElementById("userInput");
  const timerSpan = document.getElementById("timer");
  const numWordsSpan = document.getElementById("numWords");
  const tileDiv = document.getElementById("tiles");
  const board = document.getElementById("board");
  const startBtn = document.getElementById("start");

  let timerCounter = 120;
  let numWordsFound = 0;
  let totalWords = 0;
  let numBonusWords = 0;
  let numRounds = 0;

  let tiles = []; // array of tile objects
  let word = ""; // word to be guessed

  // pre game setup
  function setup() {
    const gameContainer = document.getElementById("game");
  }

  function createTile(letter) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tiveDiv.appendChild(tile);

    let letterSpan = document.createElement("span");
    letterSpan.innerText = letter.toUpperCase();
    tile.appendChild(letterSpan);

    let used = false;
    let tileObj = { tile, letter, used };
    tiles.push(tileObj);
  }
});
