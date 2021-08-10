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
  let usedTiles = []; // array of tiles that have been used
  let word = ""; // word to be guessed
  let targetWords = []; // array of target words
  let words = [...targetWordDictionary.keys()]; // get array of keys
  // pre game setup
  function setup() {
    const gameContainer = document.getElementById("game");
    // temp
    word = words[0];
    getRandWords(words);
    setupBoard(targetWords);

    numWordsSpan.innerText = `${numWordsFound}/${totalWords}`;
    shuffleTiles();
  }
  // call setup
  setup();

  // set up board with tiles for target words
  function setupBoard(listOfWords) {
    listOfWords.forEach((target) => {
      // for each target word, create a row on the board
      let wordOnBoard = document.createElement("div");
      wordOnBoard.classList.add("wordOnBoard", "row");
      target.split("").forEach((letter) => {
        // for each letter in word, create a board tile
        let boardTile = document.createElement("div");
        boardTile.classList.add("boardTile");
        wordOnBoard.appendChild(boardTile);
        let letterSpan = document.createElement("span");
        letterSpan.classList.add("boardLetter");
        boardTile.appendChild(letterSpan);
      });
      board.appendChild(wordOnBoard);
    });
  }
  function getRandWords(words) {
    // TODO: get random word
    targetWords = targetWordDictionary.get(words[0]);
  }
  // create shuffled word and tiles
  function shuffleTiles() {
    // return array of shuffled word
    function shuffle(word) {
      let wordArr = word.split("");
      newArr = [];
      let indexSet = new Set();
      for (let i = 0; i < wordArr.length; i++) {
        let index = Math.floor(Math.random() * wordArr.length);
        while (indexSet.has(index)) {
          console.log("stuck");
          index = Math.floor(Math.random() * wordArr.length);
        }
        newArr.push(wordArr[index]);
        indexSet.add(index);
      }
      return newArr;
    }
    tiles = []; // clear tiles
    // clear tiles from board
    while (tileDiv.firstChild) {
      // remove prev children
      tileDiv.removeChild(tileDiv.lastChild);
    }
    shuffle(word).forEach((letter) => createTile(letter));

    // add letter to input when tile is clicked
    tiles.forEach((tileObj) => {
      tileObj.tile.addEventListener("click", function () {
        addLetter(tileObj.letter, tileObj);
      });
    });
  }
  function createTile(letter) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tileDiv.appendChild(tile);
    let letterSpan = document.createElement("span");
    letterSpan.innerText = letter.toUpperCase();
    tile.appendChild(letterSpan);
    let used = false;
    let tileObj = { tile, letter, used };
    tiles.push(tileObj);
  }

  function addLetter(letter, tileObj) {
    // find index of a given letter in the tile array
    function findIndex(letter, isUsed) {
      let tileIndex = -1;
      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].letter === letter && tiles[i].used === isUsed) {
          tileIndex = tiles.indexOf(tiles[i]);
          if (tileIndex !== -1) {
            tiles[i].used = true;
            break;
          }
        }
      }
      return tileIndex;
    }

    if (word.includes(letter)) {
      let letterUpper = letter.toUpperCase();
      if (tileObj === undefined) {
        // player is typing s have to find tile
        let tileIndex = findIndex(letter, false);
        if (tileIndex !== -1) {
          tileObj = tiles[tileIndex];
        }
      }
      if (tileObj !== undefined) {
        // found tile or user clicked on tile
        tileObj.tile.classList.add("used");
        tileObj.used = true;
        usedTiles.push(tileObj);
        userInput.value += letterUpper;
        console.log(userInput.value);
      }
    }
  }

  function enter() {}

  function backspace() {}

  function deleteInput() {}

  // Buttons
  document.getElementById("btnRow").childNodes.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (btn.id === "shuffle") {
        shuffleTiles();
      } else if (btn.id === "enter") {
        enter();
      } else if (btn.id === "delete") {
        deleteInput();
      } else if (btn.id === "backspace") {
        backspace();
      }
    });
  });

  document.body.addEventListener("keydown", function (event) {
    addLetter(event.key, undefined);
    if (event.key === "Enter") {
      enter();
    } else if (event.key == "Backspace") {
      backspace();
    }
  });
});
