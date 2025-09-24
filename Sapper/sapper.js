const gameEl = document.getElementById('game');
const mineCountEl = document.getElementById('mine-count');
const flagCountEl = document.getElementById('flag-count');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart');

const ROWS = 10;
const COLS = 10;
const MINES = 15;

let board = [];
let gameOver = false;
let gameWon = false;
let flagsPlaced = 0;


// Инициализация доски
function initBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill().map(() => ({
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0
    })));
}

// Расстановка мин
function placeMines(startRow, startCol) {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    // Не ставить мину на первую открытую клетку и рядом с ней
    const isFirstClick = (startRow !== -1 && startCol !== -1);
    if (isFirstClick) {
        const tooClose = Math.abs(row - startRow) <= 1 && Math.abs(col - startCol) <= 1;
        if (tooClose) continue;
    }
        
    if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minesPlaced++;
    }
    }
    calculateNumbers();
}

// Подсчёт соседних мин
function calculateNumbers() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col].isMine) continue;
            let count = 0;
            for (let r = Math.max(0, row - 1); r <= Math.min(ROWS - 1, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(COLS - 1, col + 1); c++) {
                if (board[r][c].isMine) count++;
                }
            }
            board[row][col].neighborMines = count;
        }
      }
    }

// Открытие клетки
function reveal(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
    if (board[row][col].isRevealed || board[row][col].isFlagged) return;

    board[row][col].isRevealed = true;

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('revealed');
    if (board[row][col].neighborMines > 0) {
        cell.textContent = board[row][col].neighborMines;
        cell.setAttribute('data-count', board[row][col].neighborMines);
    }

    // Если пустая — открыть соседей
    if (board[row][col].neighborMines === 0) {
        for (let r = Math.max(0, row - 1); r <= Math.min(ROWS - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(COLS - 1, col + 1); c++) {
                if (!(r === row && c === col)) {
                    reveal(r, c);
                }
            }
        }
      }
    }

    function checkWin() {
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];
          if (!cell.isMine && !cell.isRevealed) return false;
        }
      }
      return true;
    }

// Обработка клика по клетке
function handleCellClick(row, col) {
    if (gameOver || gameWon) return;
    if (board[row][col].isFlagged) return;

    // Первый клик — расставляем мины (чтобы не подорваться сразу)
    if (!gameStarted) {
        placeMines(row, col);
        gameStarted = true;
    }

    if (board[row][col].isMine) {
        gameOver = true;
        messageEl.textContent = 'Проигрыш!';
        revealAllMines();
        return;
    }
      reveal(row, col);

    if (checkWin()) {
        gameWon = true;
        messageEl.textContent = 'Победа!';
        // Поставить флаг на мину
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c].isMine && !board[r][c].isFlagged) {
                    board[r][c].isFlagged = true;
                    flagsPlaced++;
                    document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`).classList.add('flag');
                }
            }
        }
        flagCountEl.textContent = flagsPlaced;
    }
}


// Правый клик — флаг
function toggleFlag(row, col, event) {
    event.preventDefault();
    if (gameOver || gameWon || board[row][col].isRevealed) return;

    const cell = board[row][col];
    if (cell.isFlagged) {
            cell.isFlagged = false;
            flagsPlaced--;
            document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).classList.remove('flag');
    } else {
            cell.isFlagged = true;
            flagsPlaced++;
            document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).classList.add('flag');
    }
    flagCountEl.textContent = flagsPlaced;
}

// Открыть все мины при проигрыше
function revealAllMines() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col].isMine) {
                board[row][col].isRevealed = true;
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add('revealed', 'mine');
            }
        }
      }
    }

// Отрисовка доски
function renderBoard() {
    gameEl.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => handleCellClick(row, col));
            cell.addEventListener('contextmenu', (e) => toggleFlag(row, col, e));
            gameEl.appendChild(cell);
        }
    }
}

function newGame() {
    initBoard();
    renderBoard();
    gameOver = false;
    gameWon = false;
    gameStarted = false;
    flagsPlaced = 0;
    messageEl.textContent = '';
    flagCountEl.textContent = flagsPlaced;
}

let gameStarted = false;
mineCountEl.textContent = MINES;
restartBtn.addEventListener('click', newGame);
newGame();