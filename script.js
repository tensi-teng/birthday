// 3D imports removed
const terminalContainer = document.getElementById('terminal-container');
const terminal = document.getElementById('terminal');
const typingArea = document.getElementById('typing-area');
const cakeContainer = document.getElementById('cake-container');
const cake = document.getElementById('cake');

// --- Configuration ---
const msgs = [
    { text: "> Hey", delay: 1500 },
    { text: "> Today is your birthday so I coded this...", delay: 2000 },
    { text: "Executing...", delay: 1000 }
];

// --- Terminal Logic ---
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
        // Line processing finished, push to history
        const div = document.createElement('div');
        div.className = 'line';
        // HTML construction for Windows CMD style: C:\Users\Chisom> command
        div.innerHTML = `<span class="prompt-path">C:\\Users\\Chisom&gt;</span> ${currentMsg.text.replace('>', '').trim()}`; // remove leading > from msg text if present
        terminal.appendChild(div);

        typingArea.textContent = '';
        charIndex = 0;
        lineIndex++;
        setTimeout(typeLine, currentMsg.delay);
    }
}

// Start Typing
setTimeout(typeLine, 1000); // Initial delay

// --- Transition Logic ---
function transitionToCake() {
    terminalContainer.classList.add('hidden');
    cakeContainer.classList.remove('hidden');
    buildCake();
}

// --- 2D Cake Logic ---
function buildCake() {
    // Clear any existing content
    cake.innerHTML = '';

    // Create Image Element
    const img = document.createElement('img');
    img.src = 'cake.png';
    img.alt = 'Birthday Cake';
    img.className = 'cake-2d-img';

    // Add to container
    cake.appendChild(img);

    // Add Proceed Button
    addProceedButton();
}

function addProceedButton() {
    // Check if exists
    if (document.querySelector('.proceed-btn')) return;

    const btn = document.createElement('button');
    btn.textContent = "PROCEED >>";
    btn.className = 'proceed-btn';
    btn.onclick = transitionToFinalTerminal;
    cakeContainer.appendChild(btn);
}

// --- Final Terminal Logic ---
function transitionToFinalTerminal() {
    cakeContainer.classList.add('hidden');
    terminalContainer.classList.remove('hidden');

    // Clear previous terminal
    terminal.innerHTML = '';

    // Start final message sequence with longer, more flowing messages
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
    if (index >= messages.length) return;

    const msg = messages[index];

    // Create line div
    const div = document.createElement('div');
    div.classList.add('line');

    // Check if it's a link type
    if (msg.type === 'link') {
        div.innerHTML = `<span class="prompt-path">C:\\Users\\Chisom&gt;</span> <a href="${msg.url}" target="_blank" style="color: var(--accent-color); text-decoration: underline; text-shadow: 0 0 10px var(--secondary-glow); font-weight: bold;">${msg.text}</a>`;
        terminal.appendChild(div);
        runFinalTyping(messages, index + 1);
        return;
    }

    // Typing effect for text
    let charI = 0;
    div.innerHTML = `<span class="prompt-path">C:\\Users\\Chisom&gt;</span> <span class="content"></span>`;
    terminal.appendChild(div);
    const contentSpan = div.querySelector('.content');

    function typeChar() {
        if (charI < msg.text.length) {
            contentSpan.textContent += msg.text.charAt(charI);
            charI++;
            // Faster typing for long text
            setTimeout(typeChar, 20);
        } else {
            setTimeout(() => runFinalTyping(messages, index + 1), msg.delay);
        }
    }
    typeChar();
}
