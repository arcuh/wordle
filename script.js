//Selectors
const gameScreen = document.querySelector(".game");
const winScreen = document.querySelector(".win-screen");
const keyboard = document.querySelector(".game-keyboard");
const keyboardKeys = [...document.querySelectorAll(".game-keyboard-key")];
const boardTiles = [...document.querySelectorAll(".game-board-tile")];

//Key click event listener
keyboard.addEventListener("click", handleKeyboardClick);

//Global variables

const word = "MAKAN"; //Guess word
var currentTile; //Stores data about the current cell/tile (row, column)
var letterGuessed; //Stores data about the number of letters that haven't been guessed yet
var board; //Stores board tiles in a 2D style (table)

//Game initial setup
function initGame() {
    //Grouping the cells according to the row
    board = boardTiles.reduce((tiles, tile, i) => {
        const row = Math.floor(i / 5);
        tiles[row] = [].concat((tiles[row] || []), tile);
        return tiles;
    }, []);

    //Initialise current tile
    currentTile = {
        row: 0,
        column: 0,
    };

    //Initialise the current row guess
    board[currentTile.row].word = '';

    //Initialise and process letters in the word
    letterGuessed = new Map();
    processWord();
}

//Process the given word into a map
function processWord() {
    [...word].forEach((letter) => {
        (letterGuessed.has(letter)) ? letterGuessed.set(letter, letterGuessed.get(letter) + 1) : letterGuessed.set(letter, 1);
    })
}

//Funtion to handle when a keyboard key is clicked
function handleKeyboardClick(e) {
    const key = e.target;

    //Only allow key presses
    if (key.classList[0] != "game-keyboard-key") return;

    //Get key name from class, e.g. "key-w" -> will get the 'w' portion and capitalise it
    const keyName = key.classList[1].slice(4).toUpperCase();

    if (keyName == "ENTER") {
        //Checks if enter key is valid to press
        if (currentTile.column < 5 || currentTile.row >= 6) return;

        evaluateWordGuess();

        setTimeout(() => {
            currentTile.row++;
            board[currentTile.row].word = '';
            currentTile.column = 0;
        }, 5 * 500);
        return;
    }
    if (keyName == "BACKSPACE") {
        if (currentTile.column <= 0) return;
        board[currentTile.row][currentTile.column - 1].innerHTML = '';
        board[currentTile.row].word = board[currentTile.row].word.slice(0, -1);
        currentTile.column--;
        return;
    }

    if (currentTile.column > 4 || currentTile.row > 5) return;

    board[currentTile.row].word += keyName;
    console.log(board[currentTile.row].word);
    board[currentTile.row][currentTile.column].innerHTML = `<span>${keyName}<span>`;
    currentTile.column++;
}

//Function to evaluate the current guess
function evaluateWordGuess() {
    //Setting the correct letters to be green and making the rest default
    [...board[currentTile.row].word].forEach((letter, index) => {
        if (letter == word[index]) {
            board[currentTile.row][index].color = "green";
            letterGuessed.set(letter, letterGuessed.get(letter) - 1);
        } else board[currentTile.row][index].color = "default";
    });

    //Setting the correct but wrong placement letters to be yellow
    [...board[currentTile.row].word].forEach((letter, index) => {
        if (letterGuessed.has(letter) && letterGuessed.get(letter) > 0) {
            board[currentTile.row][index].color = "yellow";
            letterGuessed.set(letter, letterGuessed.get(letter) - 1);
        }
    });

    //Adding classes based on color
    board[currentTile.row].forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add("colored-tile");
            const letter = board[currentTile.row].word.charAt(index);
            const key = keyboardKeys.find((key) => { return key.classList.contains(`key-${letter.toLowerCase()}`) });
            if (tile.color == "green") {
                tile.classList.add("green-tile");
                key.classList.add("green-tile");
            }
            else if (tile.color == "yellow") {
                tile.classList.add("yellow-tile");
                tile.classList.contains("green-tile") && key.classList.add("yellow-tile");
            }
            else if (tile.color == "default") {
                tile.classList.add("default-tile");
                !letterGuessed.has(letter) && key.classList.add("default-tile");
            }
        }, index * 500);
    })

    //Check if win and reset the letterGuessed variable
    setTimeout(() => {
        if (board[currentTile.row].every((tile) => { return tile.color == "green" })) showWinScreen;

        letterGuessed.clear();
        processWord();
    }, 5 * 500)
}

//Function to show win screen
function showWinScreen() {
    gameScreen.classList.add("unclickable");
    winScreen.classList.remove("hide");
}

initGame();