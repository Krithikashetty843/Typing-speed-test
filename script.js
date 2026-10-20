
const passageText =
    "Learning to type faster takes patience and regular practice. " +
    "Good typing skills help students complete assignments and " +
    "communicate efficiently. Focus on accuracy first, maintain " +
    "a comfortable posture, and gradually improve your speed. " +
    "Practice every day to become a confident and faster typist.";

const passageElement = document.getElementById("passage");
const input = document.getElementById("typing-input");

const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const bestElement = document.getElementById("best");
const bestStatElement = document.getElementById("best-stat");
const errorsElement = document.getElementById("errors");
const statusElement = document.getElementById("status");
const progressElement = document.getElementById("progress");
const resultElement = document.getElementById("result");

const DURATION = 30;

let startTime = null;
let timer = null;
let finished = false;

let bestWpm = Number(localStorage.getItem("typingBest")) || 0;

function displayPassage() {
    passageElement.replaceChildren();

    for (const character of passageText) {
        const letter = document.createElement("span");
        letter.textContent = character;
        passageElement.appendChild(letter);
    }
}

function calculateStats() {
    const typedText = input.value;
    let correctCharacters = 0;
    let errors = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === passageText[i]) {
            correctCharacters++;
        } else {
            errors++;
        }
    }

    const accuracy = typedText.length === 0
        ? 100
        : Math.round((correctCharacters / typedText.length) * 100);

    const elapsedSeconds = startTime === null
        ? 0
        : Math.min((Date.now() - startTime) / 1000, DURATION);

    const elapsedMinutes = elapsedSeconds / 60;

    const wpm = elapsedMinutes > 0
        ? Math.round((correctCharacters / 5) / elapsedMinutes)
        : 0;

    return {
        typedText,
        correctCharacters,
        errors,
        accuracy,
        elapsedSeconds,
        wpm
    };
}

function updateScreen() {
    const stats = calculateStats();
    const letters = passageElement.querySelectorAll("span");

    letters.forEach((letter, index) => {
        letter.className = "";

        if (index < stats.typedText.length) {
            if (stats.typedText[index] === passageText[index]) {
                letter.classList.add("correct");
            } else {
                letter.classList.add("incorrect");
            }
        }

        if (index === stats.typedText.length) {
            letter.classList.add("current");
        }
    });

    const remaining = Math.max(
        0,
        DURATION - Math.floor(stats.elapsedSeconds)
    );

    timeElement.textContent = remaining + "s";
    wpmElement.textContent = stats.wpm;
    accuracyElement.textContent = stats.accuracy + "%";
    errorsElement.textContent = "Errors: " + stats.errors;

    bestElement.textContent = bestWpm;
    bestStatElement.textContent = bestWpm;

    const progress = Math.min(
        (stats.typedText.length / passageText.length) * 100,
        100
    );

    progressElement.style.width = progress + "%";
}

function startTest() {
    if (startTime !== null || finished) {
        return;
    }

    startTime = Date.now();
    statusElement.textContent = "Test in progress...";

    timer = setInterval(() => {
        updateScreen();

        if (calculateStats().elapsedSeconds >= DURATION) {
            finishTest();
        }
    }, 100);
}

function finishTest() {
    if (finished) {
        return;
    }

    finished = true;
    clearInterval(timer);
    input.disabled = true;

    const stats = calculateStats();

    if (stats.wpm > bestWpm) {
        bestWpm = stats.wpm;
        localStorage.setItem("typingBest", bestWpm);
    }

    updateScreen();

    statusElement.textContent = "Test completed!";
    resultElement.hidden = false;

    document.getElementById("final-wpm").textContent =
        stats.wpm + " WPM";

    document.getElementById("final-accuracy").textContent =
        stats.accuracy + "%";

    document.getElementById("final-errors").textContent =
        stats.errors;

    document.getElementById("result-message").textContent =
        stats.accuracy >= 95
            ? "Excellent accuracy! Keep it up."
            : "Good effort! Keep practising.";

    bestElement.textContent = bestWpm;
    bestStatElement.textContent = bestWpm;
}

function resetTest() {
    clearInterval(timer);

    timer = null;
    startTime = null;
    finished = false;

    input.value = "";
    input.disabled = false;

    resultElement.hidden = true;
    statusElement.textContent = "Click in the text area and start typing!";

    displayPassage();
    updateScreen();

    input.focus();
}

input.addEventListener("input", () => {
    if (finished) {
        return;
    }

    if (input.value.length > 0) {
        startTest();
    }

    updateScreen();

    if (input.value.length >= passageText.length) {
        finishTest();
    }
});

document.getElementById("restart").addEventListener("click", resetTest);

document.getElementById("try-again").addEventListener("click", resetTest);

displayPassage();
updateScreen();
