let timerInterval;
let isRunning = false;
let currentMode = 'focus';
let timeRemaining = 0;

let totalFocusSeconds = 0;
let totalRestSeconds = 0;

const timerDisplay = document.getElementById('timerDisplay');
const modeStatus = document.getElementById('modeStatus');
const modeBtn = document.getElementById('modeBtn');

const totalFocusDisplay = document.getElementById('totalFocusTime');
const totalRestDisplay = document.getElementById('totalRestTime');

const focusInputs = {
    h: document.getElementById('focusJam'),
    m: document.getElementById('focusMenit'),
    s: document.getElementById('focusDetik')
};

const restInputs = {
    h: document.getElementById('restJam'),
    m: document.getElementById('restMenit'),
    s: document.getElementById('restDetik')
};

function getInputSeconds(mode) {
    const inputs = mode === 'focus' ? focusInputs : restInputs;
    const h = parseInt(inputs.h.value) || 0;
    const m = parseInt(inputs.m.value) || 0;
    const s = parseInt(inputs.s.value) || 0;
    return h * 3600 + m * 60 + s;
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.innerText = formatTime(timeRemaining);
}

function initTimer() {
    timeRemaining = getInputSeconds(currentMode);
    updateDisplay();
}

document.getElementById('startBtn').addEventListener('click', () => {
    if (isRunning) return;

    if (timeRemaining === 0) {
        timeRemaining = getInputSeconds(currentMode);
    }

    if (timeRemaining > 0) {
        isRunning = true;
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateDisplay();

            if (currentMode === 'focus') {
                totalFocusSeconds++;
                totalFocusDisplay.innerText = formatTimeStats(totalFocusSeconds);
            } else {
                totalRestSeconds++;
                totalRestDisplay.innerText = formatTimeStats(totalRestSeconds);
            }

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                alert("Waktu Habis! ⏰");
            }
        }, 1000);
    }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
});

document.getElementById('resetBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;

    if (currentMode === 'focus') {
        focusInputs.h.value = "";
        focusInputs.m.value = "";
        focusInputs.s.value = "";
    } else {
        restInputs.h.value = "";
        restInputs.m.value = "";
        restInputs.s.value = "";
    }

    timeRemaining = 0;
    updateDisplay();
});

modeBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;

    if (currentMode === 'focus') {
        currentMode = 'rest';
        modeStatus.innerHTML = `Mode: <strong>Istirahat ☕</strong>`;
        modeStatus.style.borderColor = "#8fbc8f";
        modeBtn.innerText = "Kembali ke Mode Fokus";
        modeBtn.style.backgroundColor = "#4b4237";
    } else {
        currentMode = 'focus';
        modeStatus.innerHTML = `Mode: <strong>Fokus 🎯</strong>`;
        modeStatus.style.borderColor = "#4b4237";
        modeBtn.innerText = "Masuk Mode Istirahat";
        modeBtn.style.backgroundColor = "#a65e2e";
    }

    timeRemaining = getInputSeconds(currentMode);
    updateDisplay();
});

function formatTimeStats(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}j ${m}m` : `${m}m ${s}d`;
}

function addItem(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (input.value.trim() === "") {
        alert("Tulis sesuatu dulu dong! 📝");
        return;
    }

    const li = document.createElement('li');
    li.innerText = input.value;

    li.addEventListener('click', function () {
        this.classList.toggle('completed');
    });

    li.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        if (confirm("Hapus catatan ini?")) this.remove();
    });

    list.appendChild(li);
    input.value = "";
}

document.getElementById('todoInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') addItem('todoInput', 'todoList');
});

document.getElementById('laterInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') addItem('laterInput', 'laterList');
});

initTimer();