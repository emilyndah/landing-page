// game.js
// Script responsável por adicionar interações retrô, animações de XP e validação do formulário.

// Executa o jingle na primeira interação do usuário
const jingle = document.getElementById('intro-jingle');
const muteToggle = document.querySelector('.mute-toggle');
let isMuted = false;
let jinglePlayed = false;

const clickSfx = document.getElementById('click-sound');
const sfxButtons = document.querySelectorAll('[data-sfx]');

function playClick() {
    if (isMuted) return;
    // Reinicia o áudio para toques consecutivos
    clickSfx.currentTime = 0;
    clickSfx.play();
}

// Adiciona som de clique retrô aos botões
sfxButtons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => !isMuted && btn.classList.add('is-glowing'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('is-glowing'));
    btn.addEventListener('click', playClick);
});

// Dispara jingle no primeiro movimento do mouse ou toque
function handleFirstInteraction() {
    if (jinglePlayed || isMuted) return;
    jingle.currentTime = 0;
    jingle.volume = 0.35;
    jingle.play().catch(() => {
        // Alguns navegadores bloqueiam autoplay. Seguimos sem jingle.
    });
    jinglePlayed = true;
    window.removeEventListener('pointerdown', handleFirstInteraction);
    window.removeEventListener('mousemove', handleFirstInteraction);
}

window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
window.addEventListener('mousemove', handleFirstInteraction, { once: true });

// Controle de mute
muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        jingle.pause();
        clickSfx.pause();
        muteToggle.textContent = '🔇';
    } else {
        muteToggle.textContent = '🔊';
        if (!jinglePlayed) {
            handleFirstInteraction();
        }
    }
});

// Animação das barras de progresso
const skillBars = document.querySelectorAll('.skill__progress');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.style.getPropertyValue('--target');
            observer.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach((bar) => observer.observe(bar));

// Validação do formulário com mensagens retrô
const form = document.getElementById('contact-form');
const successMessage = document.querySelector('.contact__success');

function showRetroAlert(message) {
    alert(`⚠ SYSTEM ERROR: ${message}`);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    let hasError = false;

    [nameField, emailField].forEach((field) => field.classList.remove('error'));

    if (!nameField.value.trim()) {
        nameField.classList.add('error');
        showRetroAlert('Missing Name.');
        hasError = true;
    }

    if (!emailField.value.trim()) {
        emailField.classList.add('error');
        showRetroAlert('Missing E-mail.');
        hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        showRetroAlert('Invalid E-mail format.');
        hasError = true;
    }

    if (hasError) {
        successMessage.classList.remove('is-active');
        return;
    }

    // Exibe mensagem de sucesso retrô
    successMessage.classList.add('is-active');
    form.reset();
});
