// 1. Menu Mobile
function toggleMenu() {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('active');
}

// 2. Animação de Scroll (Reveal)
window.addEventListener('scroll', revealElements);

function revealElements() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
// Trigger inicial caso já esteja na tela
revealElements();

// 3. Lógica da Calculadora de Irrigação
function calcularEficiencia() {
    const area = parseFloat(document.getElementById('area').value);
    const eficiencia = parseFloat(document.getElementById('sistema').value);
    const resultadoBox = document.getElementById('resultado');
    
    if (isNaN(area) || area <= 0) {
        alert("Por favor, insira um tamanho de área válido (número).");
        return;
    }

    // Cálculo fictício baseado em média de 10.000 litros por hectare por ciclo sem tecnologia
    const consumoBase = area * 10000; 
    // Quanto menor o valor de 'eficiencia' (vindo do select), mais eficiente é o sistema
    // Mas no select, o valor é um multiplicador do gasto.
    // Ex: 1.0 = 100% do gasto (pior), 0.3 = 30% do gasto (melhor)
    
    const consumoNovo = consumoBase * eficiencia;
    const economia = consumoBase - consumoNovo;
    
    // Cálculo de impacto baseado no investimento
    const investimento = parseFloat(document.getElementById('investimento').value);
    let impacto = 50;
    if (!isNaN(investimento)) {
        // Se investir muito, impacto alto
        impacto = Math.min(100, Math.max(10, (investimento / area) * 2));
    }

    // Formatação
    document.getElementById('agua-economizada').innerText = economia.toLocaleString('pt-BR');
    document.getElementById('impacto').innerText = impacto.toFixed(1);

    resultadoBox.style.display = 'block';
    resultadoBox.style.animation = 'fadeIn 0.5s ease';
}

// 4. FAQ Accordion Toggle
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('span');
    
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        icon.innerText = '+';
        button.style.color = 'var(--text-main)';
    } else {
        // Fecha outros abertos (opcional)
        document.querySelectorAll('.faq-answer').forEach(item => {
            item.classList.remove('active');
            item.previousElementSibling.querySelector('span').innerText = '+';
            item.previousElementSibling.style.color = 'var(--text-main)';
        });

        answer.classList.add('active');
        icon.innerText = '-';
        button.style.color = 'var(--neon-blue)';
    }
}

// 5. Canvas Animation (Background de Partículas - Rede Digital)
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Ajustar tamanho
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Desenhar
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00f3ff';
        ctx.fill();
    }
    // Atualizar movimento
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    // Número de partículas ajustado ao tamanho da tela
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#00f3ff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            // Conectar se estiverem perto
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(0, 243, 255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Resize event para redimensionar o canvas
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

init();
animate();