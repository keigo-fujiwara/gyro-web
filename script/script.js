const canvas = document.getElementById('c');
const context = canvas.getContext('2d');
const debugElement = document.getElementById('debug');
const button = document.getElementById('btn');

const petalCount = 90;
const petals = [];
const petalImg = new Image();
petalImg.src = 'img/petal.png';

let last = performance.now();

function rand(a, b) {
   return a + Math.random() * (b - a);
}

function resize() {
    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function generatePetal(fromTop = true) {
    const petal = {};
    petal.x = rand(0, innerWidth);
    petal.y = fromTop ? rand(-innerHeight * 0.2, 0) : rand(0, innerHeight);
    petal.size = rand(32, 64);
    petal.angle = rand(0, 2 * Math.PI);                              // 花びらの角度
    petal.alpha = rand(0.6, 1);                                      // 花びらの透明度
    petal.fallSpeed = rand(40, 90);                                  // 落下速度
    petal.driftSpeed = rand(-15, 15);                                // 横滑りの速度
    petal.rotateSpeed = rand((-Math.PI * 2) / 3, (Math.PI * 2) / 3); // 花びらの回転速度
    petal.swayPhase = rand(0, 2 * Math.PI);                          // 揺れの初期位相
    petal.swayAmp = rand(4, 16);                                     // 揺れの振幅
    petal.swayPhaseSpeed = rand(0.6, 1.6);                           // 揺れの変化率（角速度）
    return petal;
}

function generatePetals(petalCount) {
    for (let i = 0; i < petalCount; i++) {
        const petal = generatePetal(false);
        petals.push(petal);
    }
}

function drawPetals(petals) {
    if (!petalImg.complete) return;

    petals.forEach((petal) => {
        // (x, y)を中心に、angle(度)回転した花びらを size の大きさで描画
        context.save();

        context.translate(petal.x, petal.y);
        context.rotate(petal.angle);
        context.globalAlpha = petal.alpha;

        const width = petal.size;
        const height = petal.size;
        context.drawImage(petalImg, -width / 2, -height / 2, width, height);

        context.restore();
    });
}

function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    context.clearRect(0, 0, innerWidth, innerHeight);
    context.fillStyle = 'rgba(11,16,32,1)';
    context.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < petals.length; i++) {
        const petal = petals[i];
        petal.swayPhase += petal.swayPhaseSpeed * dt;
        const swaySpeed = petal.swayAmp * Math.sin(petal.swayPhase);

        const speedX = petal.driftSpeed + swaySpeed;
        const speedY = petal.fallSpeed;

        petal.x += speedX * dt;
        petal.y += speedY * dt;
        petal.angle += petal.rotateSpeed * dt;

        if (
            petal.y > innerHeight + 64 ||
            petal.x < -60 ||
            petal.x > innerWidth + 60
        ) {
            const newPetal = generatePetal();
            // 既存の petal を newPetal と入れ替え
            petals[i] = newPetal;
        }
    }
    drawPetals(petals);
    requestAnimationFrame(tick);
}

window.addEventListener('resize', resize);

window.addEventListener('DOMContentLoaded', () => {
    resize();
    generatePetals(petalCount);
    tick(performance.now());
});