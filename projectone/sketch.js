// sketch.js
let pathPoints = [];
let currentProgress = 0;
let showRadar = false;
let finalScores = {};

// 记录已触发的题目，避免重复弹窗
let triggeredTriggers = [];

function startPathDrawing() {
    pathPoints = [];
    for (let y = -50; y <= height + 50; y += 5) {
        let x = width / 2 + sin(y * 0.015) * 120;
        pathPoints.push(createVector(x, y));
    }
}

function updatePathProgress(prog) {
    currentProgress = prog;
}

function drawRadarChart(scores) {
    finalScores = { ...scores };
    showRadar = true;
    loop(); // 确保雷达图被绘制
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');
    textFont("Kranky");

    loop(); // ✅ 关键：持续刷新，否则 draw 只跑一次，emoji 不会出现
}

function draw() {
    clear();

    if (showRadar) {
        drawRadar();
        return;
    }

    if (pathPoints.length === 0) return;

    let pointsToShow = floor(map(currentProgress, 0, 100, 0, pathPoints.length));
    pointsToShow = constrain(pointsToShow, 0, pathPoints.length);

    // 绘制已走过的路径
    noFill();
    stroke(255, 180);
    strokeWeight(4);
    beginShape();
    for (let i = 0; i < pointsToShow; i++) {
        vertex(pathPoints[i].x, pathPoints[i].y);
    }
    endShape();

    // 绘制景物（已答过的不再显示）
    drawTriggerItem('leaf', 20, '🍃');
    drawTriggerItem('flower', 50, '🌸');
    drawTriggerItem('fish', 80, '🐟');
}

function drawTriggerItem(triggerType, progressPercent, emoji) {
    // 还没走到这个位置 → 不显示
    if (currentProgress < progressPercent) return;
    // 已经答过这道题 → 不再显示
    if (triggeredTriggers.includes(triggerType)) return;

    let index = floor(map(progressPercent, 0, 100, 0, pathPoints.length - 1));
    index = constrain(index, 0, pathPoints.length - 1);
    let pos = pathPoints[index];

    textSize(36);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(255);
    text(emoji, pos.x, pos.y);
}

function mousePressed() {
    if (showRadar || pathPoints.length === 0) return;
    // 弹窗打开时不处理点击
    if (typeof quizModal !== 'undefined' && !quizModal.classList.contains('hide')) return;

    checkClick('leaf', 20, '🍃');
    checkClick('flower', 50, '🌸');
    checkClick('fish', 80, '🐟');
}

function checkClick(triggerType, progressPercent, emoji) {
    if (currentProgress < progressPercent) return;
    if (triggeredTriggers.includes(triggerType)) return;

    let index = floor(map(progressPercent, 0, 100, 0, pathPoints.length - 1));
    index = constrain(index, 0, pathPoints.length - 1);
    let pos = pathPoints[index];

    if (dist(mouseX, mouseY, pos.x, pos.y) < 40) {
        triggeredTriggers.push(triggerType);
        if (typeof triggerQuiz === 'function') {
            triggerQuiz(triggerType);
        }
    }
}

function drawRadar() {
    let cx = width / 2;
    let cy = height / 2;
    let radius = min(width, height) * 0.3;
    let dimensions = Object.keys(finalScores);
    if (dimensions.length === 0) return;

    let angleStep = TWO_PI / dimensions.length;

    background(245, 248, 252);

    // 背景网格
    for (let i = 1; i <= 5; i++) {
        noFill();
        stroke(210);
        strokeWeight(1);
        beginShape();
        for (let a = 0; a < TWO_PI; a += angleStep) {
            let r = map(i, 0, 5, 0, radius);
            vertex(cx + cos(a) * r, cy + sin(a) * r);
        }
        endShape(CLOSE);
    }

    // 轴线
    stroke(180);
    for (let i = 0; i < dimensions.length; i++) {
        let a = i * angleStep - HALF_PI;
        line(cx, cy, cx + cos(a) * radius, cy + sin(a) * radius);
    }

    // 数据多边形
    let maxScore = 10;
    fill(100, 150, 255, 160);
    stroke(80, 120, 240);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < dimensions.length; i++) {
        let value = finalScores[dimensions[i]] || 0;
        let r = map(constrain(value, 0, maxScore), 0, maxScore, 0, radius);
        let a = i * angleStep - HALF_PI;
        vertex(cx + cos(a) * r, cy + sin(a) * r);
    }
    endShape(CLOSE);

    // 数据点
    noStroke();
    fill(60, 100, 220);
    for (let i = 0; i < dimensions.length; i++) {
        let value = finalScores[dimensions[i]] || 0;
        let r = map(constrain(value, 0, maxScore), 0, maxScore, 0, radius);
        let a = i * angleStep - HALF_PI;
        circle(cx + cos(a) * r, cy + sin(a) * r, 8);
    }

    // 标签
    fill(50);
    textSize(16);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < dimensions.length; i++) {
        let a = i * angleStep - HALF_PI;
        let labelX = cx + cos(a) * (radius + 35);
        let labelY = cy + sin(a) * (radius + 35);
        let label = dimensions[i] === 'curiosity' ? 'Curiosity'
                    : dimensions[i] === 'calm' ? 'Calmness'
                    : 'Exploration';
        let val = finalScores[dimensions[i]] || 0;
        text(label + ' (' + val + ')', labelX, labelY);
    }

    textSize(22);
    fill(40);
    text("	Your Winter Personality Map", cx, cy - radius - 60);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // 重新生成路径
    if (pathPoints.length > 0) {
        startPathDrawing();
    }
}