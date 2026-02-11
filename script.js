// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedY = -(Math.random() * 0.3 + 0.05);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.5 ? 187 : 320; // cyan or pink
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.001;
        if (this.y < 0 || this.opacity <= 0) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.3)`;
        ctx.fill();
    }
}

const particleCount = window.innerWidth <= 480 ? 25 : 60;
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.shadowBlur = 0;
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== DOM REFERENCES =====
const terminalContainer = document.getElementById('terminal-container');
const terminal = document.getElementById('terminal');
const typingArea = document.getElementById('typing-area');
const cakeContainer = document.getElementById('cake-container');
const cake = document.getElementById('cake');

// ===== CONFIGURATION =====
const msgs = [
    { text: "> Hey", delay: 1500 },
    { text: "> Today is your birthday so I coded this...", delay: 2000 },
    { text: "Executing...", delay: 1000 }
];

// ===== TERMINAL LOGIC =====
let lineIndex = 0;
let charIndex = 0;

function typeLine() {
    if (lineIndex >= msgs.length) {
        setTimeout(transitionToCake, 1000);
        return;
    }

    const currentMsg = msgs[lineIndex];
    if (charIndex < currentMsg.text.length) {
        typingArea.textContent += currentMsg.text.charAt(charIndex);
        charIndex++;
        setTimeout(typeLine, 50 + Math.random() * 50);
    } else {
        // Push completed line to terminal history
        const div = document.createElement('div');
        div.className = 'line';
        div.innerHTML = `<span class="prompt-path">C:\\Users\\Chisom&gt;</span> ${currentMsg.text.replace('>', '').trim()}`;
        terminal.appendChild(div);

        typingArea.textContent = '';
        charIndex = 0;
        lineIndex++;
        setTimeout(typeLine, currentMsg.delay);
    }
}

// Start typing after a short delay
setTimeout(typeLine, 1200);

// ===== TRANSITION LOGIC =====
function transitionToCake() {
    terminalContainer.classList.add('hidden');
    cakeContainer.classList.remove('hidden');
    buildCake();
}

// ===== 2D CAKE LOGIC =====
function buildCake() {
    cake.innerHTML = '';

    const img = document.createElement('img');
    img.src = 'cake.png';
    img.alt = 'Birthday Cake';
    img.className = 'cake-2d-img';
    cake.appendChild(img);

    addProceedButton();
}

function addProceedButton() {
    if (document.querySelector('.proceed-btn')) return;

    const btn = document.createElement('button');
    btn.textContent = "PROCEED >>";
    btn.className = 'proceed-btn';
    btn.onclick = transitionToFinalTerminal;
    cakeContainer.appendChild(btn);
}

// ===== FINAL TERMINAL LOGIC =====
function transitionToFinalTerminal() {
    cakeContainer.classList.add('hidden');
    terminalContainer.classList.remove('hidden');

    terminal.innerHTML = '';
    typingArea.textContent = '';

    const finalMsgs = [
        { text: "So, yeah… you're old. Like, really old. Happy birthday, Chisom—heh.", delay: 2500 },
        { text: "I don't say this very often, but I am proud of you.", delay: 2500 },
        { text: "It has been a long road, but it's turning out better than you expected, and for that, I am grateful.", delay: 3000 },
        { text: "You still don't have a girlfriend, even with your sweet mouth—tch, what a letdown 😂.", delay: 2500 },
        { text: "Anyways, happy birthday. Wishing you more success, triumph, a girl, grace, peace, and clarity.", delay: 3500 },
        { text: "", delay: 1500 },
        { text: "Oh, and here's your playlist...", delay: 2000 },
        {
            text: "CLICK_HERE 🎁",
            type: 'link',
            url: "https://open.spotify.com/playlist/6lhsEtoWIQEeL8idVTwDrv?si=rIQcStOvS224cGgo-Lo8Pw",
            delay: 0
        }
    ];

    runFinalTyping(finalMsgs, 0);
}

function runFinalTyping(messages, index) {
    if (index >= messages.length) {
        document.querySelector('.cursor').style.display = 'none';
        return;
    }

    const msg = messages[index];
    let charI = 0;
    typingArea.textContent = '';

    function typeChar() {
        if (charI < msg.text.length) {
            typingArea.textContent += msg.text.charAt(charI);
            charI++;
            // Auto-scroll while typing
            terminalContainer.scrollTop = terminalContainer.scrollHeight;
            setTimeout(typeChar, 20);
        } else {
            const div = document.createElement('div');
            div.classList.add('line');

            if (msg.type === 'link') {
                div.innerHTML = `<span class="prompt-path">C:\\Users\\Chisom&gt;</span> <a href="${msg.url}" target="_blank">${msg.text}</a>`;
            } else {
                div.innerHTML = `<span class="prompt-path">C:\\Users\\Chisom&gt;</span> ${msg.text}`;
            }

            terminal.appendChild(div);
            typingArea.textContent = '';

            // Auto-scroll
            terminalContainer.scrollTop = terminalContainer.scrollHeight;

            setTimeout(() => runFinalTyping(messages, index + 1), msg.delay);
        }
    }
    typeChar();
}
