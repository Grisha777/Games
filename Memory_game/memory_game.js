const gameBoard = document.getElementById('gameBoard');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

const emojis = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍑', '🥝'];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let matchedPairs = 0;
let timer = 30;
let timerInterval = null;
let gameActive = true;

// Перемешивание карточек
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Создание карточек
function initGame() {
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    timer = 30;
    gameActive = true;
    timeDisplay.textContent = timer;
    scoreDisplay.textContent = matchedPairs;
    messageEl.textContent = '';
    restartBtn.style.display = 'none';

    shuffle(cards);

    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.value = emoji;

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
      });

    // Запуск таймера
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameActive) return;
            timer--;
            timeDisplay.textContent = timer;
        if (timer <= 0) {
          endGame(false);
        }
    }, 1000);
}

// Переворот карточки
function flipCard(card) {
    if (!gameActive || card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }

    card.textContent = card.dataset.value;
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
    checkMatch();
    }
}

// Проверка пары
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {

    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    scoreDisplay.textContent = matchedPairs;

    flippedCards = [];

    if (matchedPairs === 8) {
        endGame(true);
    }
    } else {
        // Нет совпадения (переворачивает обратно через 1 сек)
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          card1.textContent = '';
          card2.textContent = '';
          flippedCards = [];
        }, 1000);
      }
    }

function endGame(isWin) {
    gameActive = false;
    clearInterval(timerInterval);

    if (isWin) {
        messageEl.textContent = 'Победа! Все пары найдены!';
    } else {
        messageEl.textContent = 'Время вышло! Игра окончена.';
    }
    restartBtn.style.display = 'block';
}

restartBtn.addEventListener('click', initGame);
initGame();