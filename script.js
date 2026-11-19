const music = document.getElementById('bg-music');
const portal = document.getElementById('portal');
const main = document.getElementById('main-content');

function unlockUniverse() {
    music.play().catch(() => {});
    portal.classList.add('hidden');
    setTimeout(() => {
        main.classList.add('visible');
    }, 300);
}

// --- MOTORE GRAFICO VETTORIALE SU CANVAS ---
const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function drawVectorMoon(ctx, size) {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0.25 * Math.PI, 1.75 * Math.PI, false);
    ctx.arc(size * 0.45, -size * 0.1, size * 0.85, 1.65 * Math.PI, 0.35 * Math.PI, true);
    ctx.closePath();
    ctx.stroke();
}

function drawVectorBear(ctx, size) {
    // Orecchie
    ctx.beginPath();
    ctx.arc(-size * 0.65, -size * 0.65, size * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size * 0.65, -size * 0.65, size * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    // Testa
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.85, 0, Math.PI * 2);
    ctx.stroke();
    // Musetto
    ctx.beginPath();
    ctx.ellipse(0, size * 0.2, size * 0.28, size * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
}

function drawVectorHeart(ctx, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size, 0, -size, topCurveHeight);
    ctx.bezierCurveTo(-size, size * 0.7, 0, size * 0.9, 0, size * 1.2);
    ctx.bezierCurveTo(0, size * 0.9, size, size * 0.7, size, topCurveHeight);
    ctx.bezierCurveTo(size, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.stroke();
}

const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.3 + 0.2,
    a: Math.random(),
    s: Math.random() * 0.18 + 0.04
}));

const types = ['moon', 'bear', 'heart'];
const floaters = Array.from({ length: 18 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    type: types[Math.floor(Math.random() * types.length)],
    size: Math.random() * 7 + 8,
    vy: Math.random() * 0.3 + 0.1,
    angle: Math.random() * Math.PI * 2,
    vAngle: (Math.random() - 0.5) * 0.006
}));

function render() {
    ctx.clearRect(0, 0, w, h);

    // Stelle luminose
    stars.forEach(st => {
        st.a += (Math.random() - 0.5) * 0.02;
        st.a = Math.max(0.1, Math.min(0.85, st.a));
        ctx.fillStyle = `rgba(255, 255, 255, ${st.a})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();

        st.y -= st.s;
        if (st.y < 0) {
            st.y = h;
            st.x = Math.random() * w;
        }
    });

    // Lune, Pupazzi e Cuori vettoriali
    floaters.forEach(fl => {
        ctx.save();
        ctx.translate(fl.x, fl.y);
        ctx.rotate(fl.angle);
        ctx.strokeStyle = fl.type === 'moon' ? 'rgba(232, 216, 156, 0.22)' : 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1.1;

        if (fl.type === 'moon') drawVectorMoon(ctx, fl.size);
        else if (fl.type === 'bear') drawVectorBear(ctx, fl.size);
        else drawVectorHeart(ctx, fl.size * 0.8);

        ctx.restore();

        fl.y -= fl.vy;
        fl.angle += fl.vAngle;
        if (fl.y < -30) {
            fl.y = h + 30;
            fl.x = Math.random() * w;
        }
    });

    requestAnimationFrame(render);
}
render();