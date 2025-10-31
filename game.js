// game.js
// Script para interações retrô: áudio chiptune, cliques com SFX e animação das barras de XP.

const jingle = document.getElementById('intro-jingle');
const clickSfx = document.getElementById('click-sound');
const muteToggle = document.querySelector('.mute-toggle');
const sfxElements = document.querySelectorAll('[data-sfx]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isMuted = false;
let jinglePlayed = false;

function playClick() {
    if (isMuted || !clickSfx) return;
    clickSfx.currentTime = 0;
    clickSfx.play().catch(() => {});
}

sfxElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
        if (isMuted) return;
        element.classList.add('is-glowing');
    });
    element.addEventListener('mouseleave', () => {
        element.classList.remove('is-glowing');
    });
    element.addEventListener('click', playClick);
});

function triggerJingle() {
    if (jinglePlayed || isMuted || !jingle) return;
    jingle.currentTime = 0;
    jingle.volume = 0.35;
    jingle.play().catch(() => {});
    jinglePlayed = true;
    window.removeEventListener('pointerdown', triggerJingle);
    window.removeEventListener('mousemove', triggerJingle);
}

window.addEventListener('pointerdown', triggerJingle, { once: true });
window.addEventListener('mousemove', triggerJingle, { once: true });

if (muteToggle) {
    muteToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        muteToggle.textContent = isMuted ? '🔇' : '🔊';
        if (jingle && isMuted) {
            jingle.pause();
        }
        if (clickSfx && isMuted) {
            clickSfx.pause();
        }
        if (!isMuted && !jinglePlayed) {
            triggerJingle();
        }
    });
}

const skillBars = document.querySelectorAll('.skill__progress');

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const targetWidth = bar.style.getPropertyValue('--target') || '0%';
            requestAnimationFrame(() => {
                bar.style.width = targetWidth;
            });
            observer.unobserve(bar);
        });
    }, { threshold: 0.35 });

    skillBars.forEach((bar) => observer.observe(bar));
} else {
    skillBars.forEach((bar) => {
        const targetWidth = bar.style.getPropertyValue('--target') || '0%';
        bar.style.width = targetWidth;
    });
}
