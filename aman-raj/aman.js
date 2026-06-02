// Move ambient background light aura relative to cursor location
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
});

// Close dropdown when navigation elements are targeted
document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById("menuBtn").classList.remove("active");
        document.getElementById("navMenu").classList.remove("open");
    });
});

// Typing Array Loop String Logic Engine
const codingPhrases = ["Learning HTML", "Learning CSS", "Learning JavaScript", "Learning Python"];
let phaseIdx = 0;
let charIdx = 0;
let removing = false;
const targetElement = document.querySelector('.typing-text');

function executeTypingLoop() {
    const fullString = codingPhrases[phaseIdx];

    if (removing) {
        targetElement.textContent = fullString.substring(0, charIdx - 1);
        charIdx--;
    } else {
        targetElement.textContent = fullString.substring(0, charIdx + 1);
        charIdx++;
    }

    if (!removing && charIdx === fullString.length) {
        setTimeout(() => removing = true, 2200);
        setTimeout(executeTypingLoop, 2200);
    } else if (removing && charIdx === 0) {
        removing = false;
        phaseIdx = (phaseIdx + 1) % codingPhrases.length;
        setTimeout(executeTypingLoop, 200);
    } else {
        setTimeout(executeTypingLoop, removing ? 40 : 80);
    }
}

// Lightweight Procedural HTML Canvas Starfield Background
function generateStarfieldMatrix() {
    const canvas = document.getElementById('starfield-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const count = 45;

    function matchCanvasBounds() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    matchCanvasBounds();
    window.addEventListener('resize', matchCanvasBounds);

    class StarParticle {
        constructor() {
            this.initCoordinates();
        }
        initCoordinates() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.3;
            this.alphaDelta = Math.random() * 0.007 + 0.003;
            this.opacity = Math.random();
            this.direction = Math.random() > 0.5 ? 1 : -1;
        }
        drawAndUpdate() {
            this.opacity += this.alphaDelta * this.direction;
            if (this.opacity >= 1 || this.opacity <= 0) {
                this.direction *= -1;
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(157, 78, 221, ${Math.max(0, this.opacity * 0.35)})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < count; i++) {
        stars.push(new StarParticle());
    }

    function animationFrameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => s.drawAndUpdate());
        requestAnimationFrame(animationFrameLoop);
    }
    animationFrameLoop();
}

// Window Interception Scroll Reveal Observer Sub-Routine
function scrollRevealObserver() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 70;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
}
window.addEventListener('scroll', scrollRevealObserver);

// --- Exact Requested JavaScript Event & Formspree Logic Implemented ---
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.classList.toggle("open");
});

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";
    status.style.color = "#fff";

    const data = new FormData(form);

    try {
        const response = await fetch("https://formspree.io/f/mqedkzoe", {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json"
            }
        });

        if (response.ok) {
            form.reset();

            status.textContent =
                "Thank you for contacting me. I will reply soon.";
            status.style.color = "#00ff99";

            setTimeout(() => {
                status.textContent = "";
            }, 5000);

        } else {
            status.textContent = "Message failed. Please try again.";
            status.style.color = "red";
        }

    } catch (error) {
        status.textContent = "Network error. Please try later.";
        status.style.color = "red";
    }
});

// Trigger foundational background tasks as resource assets stabilize
document.addEventListener('DOMContentLoaded', () => {
    executeTypingLoop();
    generateStarfieldMatrix();
    scrollRevealObserver();
});