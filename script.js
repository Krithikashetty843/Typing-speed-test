

const passages = {
    15: {
        easy: "I love to learn new things. Practice makes us better every day.",
        medium: "Regular practice helps improve typing speed and accuracy. Stay focused and keep learning.",
        hard: "Consistent practice develops precision, confidence, and efficiency. Challenge yourself to improve."
    },

    30: {
        easy: "Typing is a useful skill for everyone. We use computers every day to study, work, and communicate. Practice slowly and try to type each word correctly. With regular practice, you can become faster and more confident.",
        medium: "Learning to type faster requires patience and regular practice. Good typing skills help students complete assignments and communicate efficiently. Focus on accuracy first, maintain a comfortable posture, and gradually improve your speed. Consistent effort will help you become a confident typist.",
        hard: "Developing exceptional typing proficiency requires discipline, concentration, and perseverance. Prioritise precision over unnecessary speed, maintain consistent rhythm, and minimise repetitive mistakes. Gradually challenge yourself with sophisticated vocabulary and complex sentence structures."
    },

    60: {
        easy: "Computers are useful tools in our daily lives. Students use them to learn, write assignments, and explore new ideas. Typing is an important skill that makes computer work easier. Start slowly and practise every day. Keep your fingers relaxed and try to look at the screen while typing. Take breaks when you feel tired. Do not worry about making mistakes because mistakes help us learn. Focus on accuracy and gradually increase your speed. Set small goals and celebrate your progress. With patience and regular practice, you can become a better typist.",
        medium: "Technology has become an important part of modern life. Students use computers to learn new skills, complete assignments, and explore different ideas. Typing efficiently saves time and improves productivity. The key to improving typing speed is regular practice. Begin slowly and focus on entering each word correctly. As your accuracy improves, your speed will increase naturally. Maintain a comfortable sitting position, keep your hands relaxed, and look at the screen instead of the keyboard. Set achievable goals, monitor your performance, and celebrate every improvement. Consistent effort can transform an ordinary typist into a confident and efficient computer user.",
        hard: "Effective communication increasingly depends on digital proficiency, particularly in academic and professional environments. Advanced typing requires coordination, concentration, and familiarity with diverse vocabulary. Although speed is valuable, accuracy remains essential because correcting mistakes consumes additional time. Establish a sustainable rhythm, maintain ergonomic posture, and avoid unnecessary tension. Gradually introduce challenging terminology, punctuation, and complex sentence structures. Monitor your performance objectively, identify recurring errors, and practise the combinations that cause difficulty. Continuous improvement depends on consistency rather than occasional bursts of effort."
    },

    120: {
        easy: "Learning a new skill takes time and patience. Typing is useful for students and professionals. It helps us write messages, complete assignments, and prepare documents. Start by sitting comfortably at your computer. Place your fingers on the keyboard and begin with simple words. Try to look at the screen instead of your hands. This will help you learn where the keys are located. Do not rush because accuracy is important. If you make a mistake, correct it and continue practising. Take short breaks to keep your hands comfortable. You can practise with different sentences every day. Record your typing speed and see how much you improve. Set small goals and work towards them. Remember that everyone learns at a different pace. Stay positive and enjoy the process. Regular practice will help you become faster and more confident.",
        medium: "Learning a new skill requires patience, practice, and a positive attitude. Typing is one of the most useful skills for students and professionals because it makes working with computers easier. A good typist can write assignments, prepare reports, send emails, and communicate ideas more quickly. However, speed should not be the only goal. Accuracy is equally important because correcting mistakes takes time. Begin by sitting comfortably and placing your fingers on the correct keys. Try to look at the screen while typing instead of looking down at your hands. Practise common words first, then move on to longer sentences and paragraphs. Over time, your fingers will learn where the keys are located. Taking regular breaks can help you stay comfortable and focused. Record your words per minute and accuracy after every test. Compare your results over several days rather than expecting immediate improvement. Consistent practice can build confidence and make everyday computer work faster and more enjoyable.",
        hard: "Mastering keyboard proficiency involves considerably more than memorising the arrangement of individual keys. It requires sustained concentration, precise finger coordination, and the ability to process complex information without interrupting the natural rhythm of typing. Professionals frequently encounter technical terminology, intricate punctuation, numerical expressions, and lengthy documentation that demand exceptional accuracy. Developing these capabilities requires deliberate practice and continuous evaluation. Begin by identifying frequently repeated mistakes and understanding the circumstances in which they occur. Gradually introduce unfamiliar vocabulary, sophisticated sentence structures, and challenging passages. Maintain an ergonomic posture to minimise unnecessary physical strain, particularly during extended sessions. Evaluate both speed and accuracy because impressive performance in one category cannot completely compensate for weaknesses in the other. Establish measurable objectives, monitor improvements consistently, and adjust your practice methods according to the results. Avoid sacrificing precision merely to achieve a higher words-per-minute score. Sustainable progress emerges through patience, analytical thinking, and disciplined repetition. Eventually, consistent training improves efficiency, strengthens confidence, and makes demanding digital communication significantly easier."
    }
};

const params = new URLSearchParams(window.location.search);

let DURATION = Number(params.get("duration")) || 30;
let DIFFICULTY = params.get("difficulty") || "easy";

let passageText = passages[DURATION]?.[DIFFICULTY] || passages[30].easy;
const difficultyDisplay = document.getElementById("difficulty-display");

if (difficultyDisplay) {
    difficultyDisplay.textContent =
        "Difficulty: " + DIFFICULTY.charAt(0).toUpperCase() + DIFFICULTY.slice(1);
}
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
        if (i < passageText.length && typedText[i] === passageText[i]) {
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
const history = JSON.parse(localStorage.getItem("typingHistory")) || [];

history.unshift({
    date: new Date().toLocaleString(),
    duration: DURATION,
    difficulty: DIFFICULTY,
    wpm: stats.wpm,
    accuracy: stats.accuracy,
    errors: stats.errors
});

localStorage.setItem("typingHistory", JSON.stringify(history.slice(0, 10)));
displayHistory();
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
const homeButton = document.getElementById("home-button");

if (homeButton) {
    homeButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}
function displayHistory() {
    const historyList = document.getElementById("history-list");

    if (!historyList) return;

    const history = JSON.parse(localStorage.getItem("typingHistory")) || [];

    if (history.length === 0) {
        historyList.innerHTML = "<p>No completed tests yet.</p>";
        return;
    }

    historyList.innerHTML = history.map(test => `
        <div class="history-item">
            <span>${test.date}</span>
            <span>${test.wpm} WPM</span>
            <span>${test.duration} sec - ${test.difficulty || "Easy"}</span>
            <span>${test.accuracy}% accuracy</span>
            <span>${test.errors} errors</span>
        </div>
    `).join("");
}

displayHistory();