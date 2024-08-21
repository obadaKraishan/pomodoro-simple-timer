// scripts/timer.js
let workDuration = 25 * 60; // 25 minutes in seconds
let breakDuration = 5 * 60; // 5 minutes in seconds
let timeLeft = workDuration;
let timerInterval;
let isWorkSession = true;

const timerDisplay = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const sessionHistory = document.getElementById('session-history');

const alertSound = new Audio('sounds/alert.mp3');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTimer() {
    timerDisplay.textContent = formatTime(timeLeft);
    const progressPercent = 100 - (timeLeft / (isWorkSession ? workDuration : breakDuration)) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timerInterval);
        alertSound.play();
        addSessionToHistory();
        isWorkSession = !isWorkSession;
        timeLeft = isWorkSession ? workDuration : breakDuration;
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
    timerDisplay.textContent = formatTime(timeLeft);
    progressBar.style.width = '0%';
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
    resetButton.classList.add('hidden');
}

function addSessionToHistory() {
    const sessionItem = document.createElement('li');
    sessionItem.textContent = `Completed a ${isWorkSession ? 'Work' : 'Break'} Session at ${new Date().toLocaleTimeString()}`;
    sessionHistory.appendChild(sessionItem);
}

function updateDurations() {
    workDuration = workDurationInput.value * 60;
    breakDuration = breakDurationInput.value * 60;
    resetTimer();
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workDurationInput.addEventListener('change', updateDurations);
breakDurationInput.addEventListener('change', updateDurations);

timerDisplay.textContent = formatTime(timeLeft);
