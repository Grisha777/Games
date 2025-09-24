const board = document.getElementById('board');
const newGameButton = document.getElementById('newGameButton');
const statusDisplay = document.getElementById('status');

let currentPlayer = 'x';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Нажатие на поле
function handleCellClick(e) {
  const clickedCell = e.target;
  const cellIndex = parseInt(clickedCell.dataset.index);

  if (gameBoard[cellIndex] !== '' || !gameActive) {
    return;
  }

// Отрисовывает в клетках и передаёт ход другому 
  gameBoard[cellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer);

  if (checkWin()) {
    statusDisplay.textContent = `${currentPlayer.toUpperCase()} выиграл!`;
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    statusDisplay.textContent = 'Ничья!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
  statusDisplay.textContent = `Ходит ${currentPlayer.toUpperCase()}`;
}

// Проверка нужной комбинации
function checkWin() {
  return win.some(condition => {
    return condition.every(index => {
      return gameBoard[index] === currentPlayer;
    });
  });
}

// Проверка заполненного поля
function checkDraw() {
  return gameBoard.every(cell => cell !== '');
}

// Создание поля игры
function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

// Сброс игры
function resetBoard() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'x';
  statusDisplay.textContent = `Ходит ${currentPlayer.toUpperCase()}`;
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x');
    cell.classList.remove('o');
  });
}

createBoard();
newGameButton.addEventListener('click', resetBoard);
resetBoard();