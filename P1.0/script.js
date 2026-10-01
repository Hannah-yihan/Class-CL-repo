// script.js
let scene = 0;
let progress = 0;
let scores = { curiosity: 0, calm: 0, exploration: 0 };
let answeredQuestions = [];
let hasShownResult = false;

const bg = document.getElementById('bg');
const textEl = document.getElementById('text');
const btn = document.getElementById('btn');
const p5Container = document.getElementById('p5-container');
const quizModal = document.getElementById('quiz-modal');

btn.addEventListener('click', () => {
    if (scene === 0) {
        scene = 1;
        bg.style.background = '#e8f4ff';
        textEl.innerText = 'Huh? There are two pine nuts at the door, and a trail of footprints in the snow...';
        btn.innerText = 'Follow the footprints';
    } else if (scene === 1) {
        scene = 2;
        textEl.innerText = 'Scroll the mouse to follow the footprints on an adventure!';
        btn.classList.add('hide');
        p5Container.classList.add('active');
        if (typeof startPathDrawing === 'function') {
            startPathDrawing();
        }
    }
});

window.addEventListener('wheel', e => {
    if (scene !== 2) return;
    // 弹窗打开时禁止滚动
    if (!quizModal.classList.contains('hide')) return;
    // 已显示结果后不再滚动
    if (hasShownResult) return;

    progress += e.deltaY * 0.05;
    progress = Math.max(0, Math.min(100, progress));

    updateSceneByProgress();

    if (typeof updatePathProgress === 'function') {
        updatePathProgress(progress);
    }

    // ✅ 
    if (progress >= 100 && !hasShownResult) {
        hasShownResult = true;
        textEl.innerText = 'Adventure complete. Generating your winter personality map...';
        p5Container.classList.remove('active');
        if (typeof drawRadarChart === 'function') {
            drawRadarChart(scores);
        }
    }
});

function updateSceneByProgress() {
    if (progress < 30) {
        bg.style.background = '#e8f4ff';
        textEl.innerText = 'Deep in the snow...';
    } else if (progress < 60) {
        bg.style.background = '#c8e6c9';
        textEl.innerText = 'Walking into a small forest';
    } else if (progress < 100) {
        bg.style.background = '#bbdefb';
        textEl.innerText = 'Arriving at a clear lake';
    }
}

function triggerQuiz(triggerType) {
    const quiz = quizData.find(q => q.trigger === triggerType && !answeredQuestions.includes(q.id));
    if (!quiz) return;

    document.getElementById('quiz-question').innerText = quiz.question;
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    quiz.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.onclick = () => handleAnswer(option.scores, quiz.id);
        optionsContainer.appendChild(button);
    });

    quizModal.classList.remove('hide');
}

function handleAnswer(points, questionId) {
    for (let key in points) {
        scores[key] = (scores[key] || 0) + points[key];
    }
    answeredQuestions.push(questionId);
    quizModal.classList.add('hide');
}
