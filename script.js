// Elements
const promptEl = document.getElementById('prompt');
const inputEl = document.getElementById('input');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const totalScoreEl = document.getElementById('total-score');

// State
let prompts = [];
let currentPrompt = '';
let currentPromptIndex = 0;
let startTime;
let timerInterval;
let totalScore = 0;

// Load prompts directly from prompts.js
prompts = promptsData.prompts;
loadPrompt();

// Load the next prompt sequentially
function loadPrompt() {
  if (prompts.length === 0) return;
  currentPrompt = prompts[currentPromptIndex];
  promptEl.textContent = currentPrompt;
  inputEl.value = '';
  inputEl.disabled = true;
  resetStats();
}

// Start typing test
startBtn.addEventListener('click', () => {
  if (!startTime) {
    inputEl.disabled = false;
    inputEl.focus();
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    inputEl.addEventListener('input', updateStats);
  }
});

// Reset everything
resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  startTime = null;
  currentPromptIndex = 0;
  totalScore = 0;
  totalScoreEl.textContent = totalScore;
  loadPrompt();
});

// Update timer
function updateTimer() {
  const now = new Date();
  const elapsed = Math.floor((now - startTime) / 1000);
  timerEl.textContent = `${elapsed}s`;
}

// Update WPM, accuracy, and score
function updateStats() {
  const typedText = inputEl.value;
  const elapsedSeconds = (new Date() - startTime) / 1000;
  const elapsedMinutes = elapsedSeconds / 60;
  const wordsTyped = typedText.trim().split(/\s+/).length;
  const wpm = elapsedMinutes > 0 ? Math.floor(wordsTyped / elapsedMinutes) : 0;
  wpmEl.textContent = wpm;

  const correctChars = countCorrectChars(currentPrompt, typedText);
  const accuracy =
    currentPrompt.length > 0
      ? Math.floor((correctChars / currentPrompt.length) * 100)
      : 0;
  accuracyEl.textContent = `${accuracy}%`;

  const score = calculateScore(wpm, accuracy, elapsedSeconds);
  scoreEl.textContent = Math.floor(score);

  if (typedText === currentPrompt) {
    endTest(score);
  }
}

// Calculate score: (WPM * Accuracy% * 10) / TimeInSeconds
function calculateScore(wpm, accuracy, timeInSeconds) {
  if (timeInSeconds === 0) return 0; // Avoid division by zero
  return (wpm * (accuracy / 100) * 10) / timeInSeconds;
}

// Count correct characters
function countCorrectChars(prompt, typed) {
  let correct = 0;
  for (let i = 0; i < Math.min(prompt.length, typed.length); i++) {
    if (prompt[i] === typed[i]) correct++;
  }
  return correct;
}

// End test and move to next prompt
function endTest(lastScore) {
  clearInterval(timerInterval);
  totalScore += lastScore;
  totalScoreEl.textContent = Math.floor(totalScore);
  inputEl.disabled = true;
  inputEl.removeEventListener('input', updateStats);
  startTime = null;

  // Move to next prompt
  currentPromptIndex = (currentPromptIndex + 1) % prompts.length; // Loop back to start
  loadPrompt();
}

// Reset stats
function resetStats() {
  wpmEl.textContent = '0';
  accuracyEl.textContent = '0%';
  timerEl.textContent = '0s';
  scoreEl.textContent = '0';
}