const puzzle = document.getElementById('puzzle');
const shuffleBtn = document.getElementById('shuffle');
const winMessage = document.getElementById('win');

let board = [];
const size = 4;
const totalTiles = size * size;

// Начальное состояние
function initBoard() {
    board = [];
    for (let i = 1; i < totalTiles; i++) {
        board.push(i);
    }
    board.push(0); // 0 — пустая ячейка
}

// Отображение доски
function renderBoard() {
    puzzle.innerHTML = '';
    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (board[i] === 0) {
          tile.classList.add('empty');
        } else {
          tile.textContent = board[i];
          tile.addEventListener('click', () => moveTile(i));
        }
        puzzle.appendChild(tile);
    }
}

// Индекс пустой ячейки
function getEmptyIndex() {
    return board.indexOf(0);
}

// Проверка можно ли двигать плитку
function canMove(tileIndex) {
    const emptyIndex = getEmptyIndex();
    const rowTile = Math.floor(tileIndex / size);
    const colTile = tileIndex % size;
    const rowEmpty = Math.floor(emptyIndex / size);
    const colEmpty = emptyIndex % size;
    const isAdjacent = (Math.abs(rowTile - rowEmpty) === 1 && colTile === colEmpty) || (Math.abs(colTile - colEmpty) === 1 && rowTile === rowEmpty);

    return isAdjacent;
}

// Перемещение плитки
function moveTile(tileIndex) {
    if (!canMove(tileIndex)) return;

    const emptyIndex = getEmptyIndex();
    [board[tileIndex], board[emptyIndex]] = [board[emptyIndex], board[tileIndex]];
    renderBoard();
    checkWin();
}

function checkWin() {
    for (let i = 0; i < totalTiles - 1; i++) {
        if (board[i] !== i + 1) return;
    }
        if (board[totalTiles - 1] !== 0) return;
    winMessage.textContent = 'Победа!';
}

// Перемешивание
function shuffle() {
    winMessage.textContent = '';
    initBoard();
    
    for (let i = 0; i < 100; i++) {
        const emptyIndex = getEmptyIndex();
        const possibleMoves = [];

        // Проверка соседей пустой ячейки
        const directions = [-1, 1, -size, size];

        for (const dir of directions) {
          const newIndex = emptyIndex + dir;
          // Проверка границ и смены строки (для лево/право)
          if (
            newIndex >= 0 &&
            newIndex < totalTiles &&
            !(dir === -1 && emptyIndex % size === 0) && // не выходим за левый край
            !(dir === 1 && emptyIndex % size === size - 1) // не выходим за правый край
          ) {
            possibleMoves.push(newIndex);
          }
        }

        if (possibleMoves.length > 0) {
          const randomTile = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          [board[randomTile], board[emptyIndex]] = [board[emptyIndex], board[randomTile]];
        }
      }
      renderBoard();
    }

shuffleBtn.addEventListener('click', shuffle);
shuffle();