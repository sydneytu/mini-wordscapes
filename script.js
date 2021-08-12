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
  let guessedWords = new Set(); // set of guessed words (correct & bonus)
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
        letterSpan.classList.add("boardLetter", "invisible");
        letterSpan.innerText = letter.toUpperCase();
        boardTile.appendChild(letterSpan);
      });
      board.appendChild(wordOnBoard);
    });
  }
  function getRandWords(words) {
    // TODO: get random word
    targetWords = targetWordDictionary.get(words[0]);
    totalWords = targetWords.length;
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

  function isValidGuess(userGuess) {
    guess = userGuess.toLowerCase();
    let isValid = false;
    let message = "";

    function displayErrorMessage(message) {
      // add error message to board
      let messageElem = document.querySelector(".errorMessage");
      messageElem.innerText = message;
      document.querySelector(".errorRow").appendChild(messageElem);
      messageElem.addEventListener("animationend", function () {
        messageElem.innerText = "";
      });
    }

    if (targetWords.includes(guess)) {
      // check first if word is in target words
      if (guessedWords.has(guess)) {
        // if target word has already been found
        message = "Already found";
        isValid = false;
      } else {
        // new word
        numWordsFound++;
        numWordsSpan.innerText = `${numWordsFound}/${totalWords}`;
        guessedWords.add(guess);
        message = "Correct!";
        isValid = true;
      }
    } else if (dictionary.includes(guess)) {
      // if not a target word, check dictionary
      if (guessedWords.has(guess)) {
        // if bonus word already been found
        message = "Bonus word already found";
      } else {
        // new bonus word
        numBonusWords++;
        guessedWords.add(guess);
        message = "Bonus word";
      }
      isValid = false;
    } else {
      // wrong word
      if (guess.length === 3) {
        // no 3 letter words
        message = "No 3 letter words";
      } else {
        message = "Wrong word";
      }
      isValid = false;
    }
    displayErrorMessage(message);

    return isValid;
  }

  // checks if guess is valid and display it on the board if true
  function enter() {
    if (userInput.value.length > 0) {
      if (isValidGuess(userInput.value)) {
        let correctGuess = userInput.value.toLowerCase();
        let index = targetWords.indexOf(correctGuess);
        let boardWord = board.childNodes[index];
        boardWord.childNodes.forEach((tile) => {
          // show word on board
          tile.style.opacity = "1.0";
          tile.childNodes[0].classList.remove("invisible");
          tile.classList.add("wordFound");
        });
      }
      deleteInput(); // clear input
    }
  }

  // functionality of backspace button, deletes last letter and places tile back
  function backspace() {
    if (userInput.value.length > 0) {
      userInput.value = userInput.value.slice(0, userInput.value.length - 1);
      let tileObj = usedTiles[usedTiles.length - 1];
      tileObj.tile.classList.remove("used");
      tileObj, (used = false);
      usedTiles.pop();
    }
  }

  // delete entire input
  function deleteInput() {
    userInput.value = "";
    tiles.forEach((tileObj) => {
      tileObj.tile.classList.remove("used");
      tileObj.used = false;
    });
    usedTiles = [];
  }

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
