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
const promptCategorySelect = document.getElementById('prompt-category');

// Theme elements
const themeLightBtn = document.getElementById('theme-light');
const themeDarkBtn = document.getElementById('theme-dark');
const themeNatureBtn = document.getElementById('theme-nature');
const themeSunsetBtn = document.getElementById('theme-sunset');
const themeBubbleGumBtn = document.getElementById('theme-bubble-gum');
const themePurpleRainBtn = document.getElementById('theme-purple-rain');
const themeDarthVaderBtn = document.getElementById('theme-darth-vader');

// State
let prompts = [];
let currentPrompt = '';
let currentPromptIndex = 0;
let startTime;
let timerInterval;
let totalScore = 0;
let currentTheme = 'light'; // Default theme
let currentCategory = 'cat-prompts'; // Default category

// Initialize prompt categories
function initPromptCategories() {
  // Clear existing options
  promptCategorySelect.innerHTML = '';
  
  // Add options for each category
  promptsData.categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    promptCategorySelect.appendChild(option);
  });
  
  // Set the default selected category
  promptCategorySelect.value = currentCategory;
  
  // Add event listener for category change
  promptCategorySelect.addEventListener('change', handleCategoryChange);
  
  // Load prompts from the default category
  loadPromptsFromCurrentCategory();
}

// Handle category change
function handleCategoryChange() {
  currentCategory = promptCategorySelect.value;
  currentPromptIndex = 0; // Reset to the first prompt in the new category
  loadPromptsFromCurrentCategory();
  localStorage.setItem('typingPracticeCategory', currentCategory);
}

// Load prompts from the selected category
function loadPromptsFromCurrentCategory() {
  const category = promptsData.categories.find(cat => cat.id === currentCategory);
  if (category) {
    prompts = category.prompts;
    loadPrompt();
  }
}

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

// Theme controls
themeLightBtn.addEventListener('click', () => setTheme('light'));
themeDarkBtn.addEventListener('click', () => setTheme('dark'));
themeNatureBtn.addEventListener('click', () => setTheme('nature'));
themeSunsetBtn.addEventListener('click', () => setTheme('sunset')); 
themeBubbleGumBtn.addEventListener('click', () => setTheme('bubble-gum'));
themePurpleRainBtn.addEventListener('click', () => setTheme('purple-rain'));
themeDarthVaderBtn.addEventListener('click', () => setTheme('darth-vader'));

function setTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove('theme-light', 'theme-dark', 'theme-nature', 'theme-sunset', 'theme-bubble-gum', 'theme-purple-rain', 'theme-darth-vader');
  
  // Add the selected theme class (if not light theme)
  if (theme !== 'light') {
    document.body.classList.add(`theme-${theme}`);
  }
  
  // Update current theme and save preference
  currentTheme = theme;
  localStorage.setItem('typingPracticeTheme', theme);
  
  // Update active button indicator
  updateActiveThemeButton();
}

function updateActiveThemeButton() {
  // Remove active status from all buttons
  themeLightBtn.style.border = '2px solid var(--border-color)';
  themeDarkBtn.style.border = '2px solid var(--border-color)';
  themeNatureBtn.style.border = '2px solid var(--border-color)';
  themeSunsetBtn.style.border = '2px solid var(--border-color)';
  themeBubbleGumBtn.style.border = '2px solid var(--border-color)';
  themePurpleRainBtn.style.border = '2px solid var(--border-color)';
  themeDarthVaderBtn.style.border = '2px solid var(--border-color)';
  
  // Set active status on current theme button
  const activeButton = document.getElementById(`theme-${currentTheme}`);
  if (activeButton) {
    activeButton.style.border = '2px solid #ff0000';
  }
}

// Load saved theme from localStorage
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('typingPracticeTheme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    updateActiveThemeButton(); // Set default active button
  }
}

// Load saved category from localStorage
function loadSavedCategory() {
  const savedCategory = localStorage.getItem('typingPracticeCategory');
  if (savedCategory) {
    currentCategory = savedCategory;
    promptCategorySelect.value = currentCategory;
    loadPromptsFromCurrentCategory();
  }
}

initPromptCategories();
loadSavedTheme();
loadSavedCategory();