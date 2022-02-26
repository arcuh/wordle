const gameScreen = document.querySelector(".game");
const winScreen = document.querySelector(".win-screen");
const keyboard = document.querySelector(".game-keyboard");
const keyboardKeys = [...document.querySelectorAll(".game-keyboard-key")];
const boardTiles = [...document.querySelectorAll(".game-board-tile")];

const word = "BAKSO";
keyboard.addEventListener("click", handleKeyboardClick);

const board = boardTiles.reduce((tiles, tile, i) => {
    const row = Math.floor(i / 5);
    tiles[row] = [].concat((tiles[row] || []), tile);
    return tiles;
}, []);

const currentTile = {
    row: 0,
    column: 0,
};
board[currentTile.row].word = '';

const letterGuessed = new Map();
processWord();

function processWord() {
    [...word].forEach((letter) => {
        if (letterGuessed.has(letter)) {
            letterGuessed.set(letter, letterGuessed.get(letter) + 1);
        } else {
            letterGuessed.set(letter, 1);
        }
    })
}

function handleKeyboardClick(e) {
    const key = e.target;
    if (key.classList[0] != "game-keyboard-key") return;

    const keyName = key.classList[1].slice(4).toUpperCase();

    if (keyName == "ENTER") {
        if (currentTile.column <= 4 || currentTile.row > 5) return;

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

function evaluateWordGuess() {
    [...board[currentTile.row].word].forEach((letter, index) => {
        if (letter == word[index]) {
            board[currentTile.row][index].color = "green";
            letterGuessed.set(letter, letterGuessed.get(letter) - 1);
        } else board[currentTile.row][index].color = "default";
    });
    [...board[currentTile.row].word].forEach((letter, index) => {
        if (letterGuessed.has(letter) && letterGuessed.get(letter) > 0) {
            board[currentTile.row][index].color = "yellow";
            letterGuessed.set(letter, letterGuessed.get(letter) - 1);
        }
    });

    board[currentTile.row].forEach((tile, index) => {
        setTimeout(() => {
            const letter = board[currentTile.row].word.charAt(index);
            const key = keyboardKeys.find((key) => { return key.classList.contains(`key-${letter.toLowerCase()}`) });
            if (tile.color == "green") {
                tile.classList.add("green-tile");
                key.classList.add("green-tile");
            }
            else if (tile.color == "yellow") {
                tile.classList.add("yellow-tile");
                key.classList.add("yellow-tile");
            }
            else if (tile.color == "default") {
                tile.classList.add("default-tile");
                !letterGuessed.has(letter) && key.classList.add("default-tile");
            }
        }, index * 500);
    })

    setTimeout(() => {
        if (board[currentTile.row].every((tile) => { return tile.color == "green" })) console.log("You win lmao");

        letterGuessed.clear();
        processWord();
    }, 5 * 500)
}

function showWinScreen() {
    gameScreen.classList.add("unclickable");
    winScreen.classList.remove("hide");
}
