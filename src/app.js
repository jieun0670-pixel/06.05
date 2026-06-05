const DISPLAY_SECONDS = 5;
const TOTAL_NUMBERS = 10;

const text = {
  ready: "\uC774\uB984\uC744 \uC785\uB825\uD558\uACE0 \uC2DC\uC791\uD558\uC138\uC694.",
  remember: (name) => `${name}\uB2D8 \uCC28\uB840\uC785\uB2C8\uB2E4. \uC22B\uC790\uB97C \uAE30\uC5B5\uD558\uC138\uC694.`,
  seconds: (left) => `${left}\uCD08`,
  answerTitle: (name) => `${name}\uB2D8 \uC815\uB2F5 \uC785\uB825`,
  answerNow: "\uC22B\uC790\uAC00 \uC0AC\uB77C\uC84C\uC2B5\uB2C8\uB2E4. \uAE30\uC5B5\uB098\uB294 \uC22B\uC790\uB97C \uC785\uB825\uD558\uC138\uC694.",
  drawName: "\uB450 \uD50C\uB808\uC774\uC5B4 \uBAA8\uB450",
  congrats: (name) => `${name} \uCD95\uD558\uD569\uB2C8\uB2E4!`,
  drawDetail: (score) => `${score}\uAC1C\uC529 \uB9DE\uCD98 \uBB34\uC2B9\uBD80\uC785\uB2C8\uB2E4.`,
  winDetail: (score) => `${score}\uAC1C\uB97C \uB9DE\uCDB0 \uC2B9\uB9AC\uD588\uC2B5\uB2C8\uB2E4.`,
  finished: "\uAC8C\uC784\uC774 \uB05D\uB0AC\uC2B5\uB2C8\uB2E4.",
  saveFailed: "\uAC8C\uC784 \uACB0\uACFC\uAC00 \uB098\uC654\uC2B5\uB2C8\uB2E4. Firebase \uC800\uC7A5\uC740 \uC124\uC815\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694.",
  playerOne: "1\uBC88",
  playerTwo: "2\uBC88",
  nthNumber: (index) => `${index + 1}\uBC88\uC9F8 \uC22B\uC790`,
};

const playersForm = document.querySelector("#playersForm");
const answerForm = document.querySelector("#answerForm");
const numbersGrid = document.querySelector("#numbersGrid");
const answerGrid = document.querySelector("#answerGrid");
const roundStatus = document.querySelector("#roundStatus");
const timerStatus = document.querySelector("#timerStatus");
const answerTitle = document.querySelector("#answerTitle");
const scoreOneName = document.querySelector("#scoreOneName");
const scoreTwoName = document.querySelector("#scoreTwoName");
const scoreOne = document.querySelector("#scoreOne");
const scoreTwo = document.querySelector("#scoreTwo");
const winnerBanner = document.querySelector("#winnerBanner");
const winnerName = document.querySelector("#winnerName");
const winnerDetail = document.querySelector("#winnerDetail");
const resetButton = document.querySelector("#resetButton");

const state = {
  players: [],
  currentPlayer: 0,
  numbers: [],
  scores: [0, 0],
  timerId: null,
};

function randomNumbers() {
  return Array.from({ length: TOTAL_NUMBERS }, () => String(Math.floor(Math.random() * 90) + 10));
}

function renderNumbers(hidden = false) {
  numbersGrid.innerHTML = "";

  state.numbers.forEach((number) => {
    const tile = document.createElement("div");
    tile.className = hidden ? "number-tile hidden-number" : "number-tile";
    tile.textContent = number;
    numbersGrid.append(tile);
  });
}

function renderAnswerInputs() {
  answerGrid.innerHTML = "";

  for (let index = 0; index < TOTAL_NUMBERS; index += 1) {
    const input = document.createElement("input");
    input.inputMode = "numeric";
    input.pattern = "[0-9]*";
    input.maxLength = 2;
    input.ariaLabel = text.nthNumber(index);
    answerGrid.append(input);
  }
}

function countCorrectAnswers() {
  const remaining = [...state.numbers];
  const answers = [...answerGrid.querySelectorAll("input")]
    .map((input) => input.value.trim())
    .filter(Boolean);

  return answers.reduce((score, answer) => {
    const foundIndex = remaining.indexOf(answer);
    if (foundIndex === -1) return score;

    remaining.splice(foundIndex, 1);
    return score + 1;
  }, 0);
}

function updateScores() {
  scoreOne.textContent = state.scores[0];
  scoreTwo.textContent = state.scores[1];
}

function startTurn() {
  const playerName = state.players[state.currentPlayer];
  state.numbers = randomNumbers();
  answerForm.hidden = true;
  timerStatus.textContent = "";
  roundStatus.textContent = text.remember(playerName);
  renderNumbers(false);

  let left = DISPLAY_SECONDS;
  timerStatus.textContent = text.seconds(left);

  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    left -= 1;
    timerStatus.textContent = text.seconds(left);

    if (left === 0) {
      clearInterval(state.timerId);
      hideNumbersAndAnswer();
    }
  }, 1000);
}

function hideNumbersAndAnswer() {
  renderNumbers(true);
  renderAnswerInputs();
  answerForm.hidden = false;
  timerStatus.textContent = "";
  answerTitle.textContent = text.answerTitle(state.players[state.currentPlayer]);
  roundStatus.textContent = text.answerNow;
  answerGrid.querySelector("input")?.focus();
}

async function showWinner() {
  const [firstScore, secondScore] = state.scores;
  const isDraw = firstScore === secondScore;
  const bestScore = Math.max(firstScore, secondScore);
  const name = isDraw ? text.drawName : state.players[firstScore > secondScore ? 0 : 1];

  winnerBanner.hidden = false;
  winnerName.textContent = text.congrats(name);
  winnerDetail.textContent = isDraw ? text.drawDetail(bestScore) : text.winDetail(bestScore);
  roundStatus.textContent = text.finished;
  answerForm.hidden = true;
  renderNumbers(true);

  try {
    await window.saveGameWinner?.({
      winner: name,
      players: state.players,
      scores: state.scores,
      isDraw,
    });
  } catch {
    roundStatus.textContent = text.saveFailed;
  }
}

playersForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(playersForm);
  state.players = [
    formData.get("playerOne").trim() || text.playerOne,
    formData.get("playerTwo").trim() || text.playerTwo,
  ];
  state.currentPlayer = 0;
  state.scores = [0, 0];
  winnerBanner.hidden = true;

  scoreOneName.textContent = state.players[0];
  scoreTwoName.textContent = state.players[1];
  updateScores();
  startTurn();
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const score = countCorrectAnswers();
  state.scores[state.currentPlayer] = score;
  updateScores();

  if (state.currentPlayer === 0) {
    state.currentPlayer = 1;
    startTurn();
    return;
  }

  showWinner();
});

resetButton.addEventListener("click", () => {
  clearInterval(state.timerId);
  state.players = [];
  state.currentPlayer = 0;
  state.numbers = [];
  state.scores = [0, 0];
  numbersGrid.innerHTML = "";
  answerGrid.innerHTML = "";
  answerForm.hidden = true;
  winnerBanner.hidden = true;
  timerStatus.textContent = "";
  roundStatus.textContent = text.ready;
  scoreOneName.textContent = text.playerOne;
  scoreTwoName.textContent = text.playerTwo;
  updateScores();
  playersForm.reset();
});
