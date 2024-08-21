let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let longBreakDuration = 15 * 60;
let sessionsBeforeLongBreak = 4;
let timeLeft = workDuration;
let timerInterval;
let isWorkSession = true;
let sessionCount = 0;
let isDarkMode = false;

const timerDisplay = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');
const sessionsBeforeLongBreakInput = document.getElementById('sessions-before-long-break');
const sessionHistory = document.getElementById('session-history');
const sessionIndicators = document.getElementById('session-indicators');
const darkModeToggle = document.getElementById('dark-mode-toggle');

const alertSound = new Audio('sounds/alert.mp3');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTimer() {
    timerDisplay.textContent = formatTime(timeLeft);
    const progressPercent = 100 - (timeLeft / (isWorkSession ? workDuration : (sessionCount === sessionsBeforeLongBreak ? longBreakDuration : breakDuration))) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timerInterval);
        alertSound.play();
        addSessionToHistory();
        sessionCount++;
        updateSessionIndicators();
        if (sessionCount === sessionsBeforeLongBreak) {
            timeLeft = longBreakDuration;
            sessionCount = 0;
        } else {
            isWorkSession = !isWorkSession;
            timeLeft = isWorkSession ? workDuration : breakDuration;
        }
        startButton.classList.remove('hidden');
        pauseButton.classList.add('hidden');
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    resetButton.classList.remove('hidden');
}

function pauseTimer() {
    clearInterval(timerInterval);
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
}

function resetTimer() {
    clearInterval(timerInterval);
    isWorkSession = true;
    timeLeft = workDuration;
    sessionCount = 0;
    timerDisplay.textContent = formatTime(timeLeft);
    progressBar.style.width = '0%';
    sessionIndicators.innerHTML = '';
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
    resetButton.classList.add('hidden');
}

function addSessionToHistory() {
    const sessionItem = document.createElement('li');
    sessionItem.textContent = `Completed a ${isWorkSession ? 'Work' : 'Break'} Session at ${new Date().toLocaleTimeString()}`;
    sessionHistory.appendChild(sessionItem);
}

function updateSessionIndicators() {
    const indicator = document.createElement('div');
    indicator.classList.add('w-4', 'h-4', 'rounded-full', isWorkSession ? 'bg-green-500' : 'bg-blue-500');
    sessionIndicators.appendChild(indicator);
}

function updateDurations() {
    workDuration = workDurationInput.value * 60;
    breakDuration = breakDurationInput.value * 60;
    longBreakDuration = longBreakDurationInput.value * 60;
    sessionsBeforeLongBreak = sessionsBeforeLongBreakInput.value;
    resetTimer();
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('bg-gray-900', isDarkMode);
    document.body.classList.toggle('text-white', isDarkMode);
    document.body.classList.toggle('bg-gray-100', !isDarkMode);
    document.body.classList.toggle('text-gray-900', !isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode);
}

function loadSettings() {
    const savedWorkDuration = localStorage.getItem('workDuration');
    const savedBreakDuration = localStorage.getItem('breakDuration');
    const savedLongBreakDuration = localStorage.getItem('longBreakDuration');
    const savedSessionsBeforeLongBreak = localStorage.getItem('sessionsBeforeLongBreak');
    const savedIsDarkMode = JSON.parse(localStorage.getItem('isDarkMode'));

    if (savedWorkDuration) workDuration = parseInt(savedWorkDuration, 10);
    if (savedBreakDuration) breakDuration = parseInt(savedBreakDuration, 10);
    if (savedLongBreakDuration) longBreakDuration = parseInt(savedLongBreakDuration, 10);
    if (savedSessionsBeforeLongBreak) sessionsBeforeLongBreak = parseInt(savedSessionsBeforeLongBreak, 10);
    if (savedIsDarkMode !== null) {
        isDarkMode = savedIsDarkMode;
        toggleDarkMode();
    }
}

function saveSettings() {
    localStorage.setItem('workDuration', workDuration);
    localStorage.setItem('breakDuration', breakDuration);
    localStorage.setItem('longBreakDuration', longBreakDuration);
    localStorage.setItem('sessionsBeforeLongBreak', sessionsBeforeLongBreak);
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workDurationInput.addEventListener('change', updateDurations);
breakDurationInput.addEventListener('change', updateDurations);
longBreakDurationInput.addEventListener('change', updateDurations);
sessionsBeforeLongBreakInput.addEventListener('change', updateDurations);
darkModeToggle.addEventListener('click', toggleDarkMode);

window.addEventListener('beforeunload', saveSettings);

loadSettings();
timerDisplay.textContent = formatTime(timeLeft);
