// ========== ENHANCED PARTICLE SYSTEM ==========
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.speed = 0.3 + Math.random() * 1.2;
        this.size = 12 + Math.random() * 18;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = -1.5 + Math.random() * 3;
        this.opacity = 0.25 + Math.random() * 0.45;
        this.sway = Math.random() * 1.5 - 0.75;
        
        // Enhanced particle types: petal, leaf, butterfly, star
        const types = ['petal', 'leaf', 'butterfly', 'star'];
        const weights = [0.35, 0.35, 0.2, 0.1]; // probability distribution
        this.type = this.weightedRandom(types, weights);
        
        // Enhanced color palettes
        if (this.type === 'petal') {
            const pinks = ['#ffb3c6', '#ff8fab', '#ffc4d6', '#ff99b3', '#ffd4e1'];
            this.color = pinks[Math.floor(Math.random() * pinks.length)];
        } else if (this.type === 'leaf') {
            const greens = ['#a8dcc0', '#8bd4ac', '#6bc99b', '#4db889', '#b8e6cf'];
            this.color = greens[Math.floor(Math.random() * greens.length)];
        } else if (this.type === 'butterfly') {
            const colors = ['#ff6b9d', '#4ecca3', '#c0a3ff', '#ffd93d'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.wingAngle = 0;
        } else if (this.type === 'star') {
            const yellows = ['#ffd700', '#ffed4e', '#fff4a3'];
            this.color = yellows[Math.floor(Math.random() * yellows.length)];
        }
    }
    
    weightedRandom(items, weights) {
        const total = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * total;
        for (let i = 0; i < items.length; i++) {
            if (random < weights[i]) return items[i];
            random -= weights[i];
        }
        return items[0];
    }
    
    update() {
        this.y += this.speed * 0.8; // Slower fall
        this.x += Math.sin(this.y * 0.006) * this.sway; // Gentler sway
        this.rotation += this.rotationSpeed * 0.7; // Slower rotation
        
        if (this.type === 'butterfly') {
            this.wingAngle = Math.sin(this.y * 0.08) * 25; // Smoother wing flap
        }
        
        if (this.y > this.canvas.height + 30) {
            this.reset();
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        if (this.type === 'petal') {
            this.drawPetal(ctx);
        } else if (this.type === 'leaf') {
            this.drawLeaf(ctx);
        } else if (this.type === 'butterfly') {
            this.drawButterfly(ctx);
        } else if (this.type === 'star') {
            this.drawStar(ctx);
        }
        
        ctx.restore();
    }
    
    drawPetal(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.55, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle gradient
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, -this.size * 0.3, this.size * 0.3, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawLeaf(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.quadraticCurveTo(this.size / 2, 0, 0, this.size / 2);
        ctx.quadraticCurveTo(-this.size / 2, 0, 0, -this.size / 2);
        ctx.fill();
        
        // Leaf vein
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(0, this.size / 2);
        ctx.stroke();
    }
    
    drawButterfly(ctx) {
        // Left wing
        ctx.save();
        ctx.rotate(this.wingAngle * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(-this.size * 0.4, 0, this.size * 0.4, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Right wing
        ctx.save();
        ctx.rotate(-this.wingAngle * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.size * 0.4, 0, this.size * 0.4, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Body
        ctx.fillStyle = '#2d2d2d';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.15, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawStar(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
    }
}

// Initialize Particle System
let canvas, ctx, particles;

function initParticles() {
    canvas = document.getElementById('particlesCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 80 particles total
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(canvas));
    }
    
    animateParticles();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    });
    
    requestAnimationFrame(animateParticles);
}

// ========== MUSIC VISUALIZER ==========
let audioContext, analyser, dataArray, visualizerCanvas, visualizerCtx;
let isVisualizerActive = false;

function initMusicVisualizer() {
    visualizerCanvas = document.getElementById('visualizerCanvas');
    visualizerCtx = visualizerCanvas.getContext('2d');
    
    visualizerCanvas.width = window.innerWidth;
    visualizerCanvas.height = 100;
    
    window.addEventListener('resize', () => {
        visualizerCanvas.width = window.innerWidth;
    });
}

function connectAudioToVisualizer() {
    const audio = document.getElementById('bgMusic');
    
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        analyser.fftSize = 128;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    
    if (!isVisualizerActive) {
        isVisualizerActive = true;
        drawVisualizer();
    }
}

function drawVisualizer() {
    if (!isVisualizerActive) return;
    
    requestAnimationFrame(drawVisualizer);
    
    analyser.getByteFrequencyData(dataArray);
    
    visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    
    const barWidth = (visualizerCanvas.width / dataArray.length) * 1.5;
    let x = 0;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const gradient = visualizerCtx.createLinearGradient(0, 0, 0, visualizerCanvas.height);
    
    if (theme === 'dark') {
        gradient.addColorStop(0, '#4ecca3');
        gradient.addColorStop(1, '#ff6b9d');
    } else {
        gradient.addColorStop(0, '#ff8fab');
        gradient.addColorStop(1, '#3d8b66');
    }
    
    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * visualizerCanvas.height * 0.8;
        
        visualizerCtx.fillStyle = gradient;
        visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth - 2, barHeight);
        
        x += barWidth;
    }
}
window.addEventListener('load', function() {
    initParticles();
    initMusicVisualizer();
 
    

    const audio = document.getElementById('bgMusic');

    document.body.addEventListener('click', async function () {

        try {
            // Play audio
            await audio.play();

            // Resume AudioContext jika suspended
            if (audioContext && audioContext.state === "suspended") {
                await audioContext.resume();
            }

            document.querySelector('.music-icon').textContent = '🎵';

            connectAudioToVisualizer();

        } catch (err) {
            console.log("Still blocked:", err);
        }

    }, { once: true });
});


function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background 0.5s ease';
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background 0.5s ease';
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}



// ========== ENTER GARDEN ==========
function enterGarden() {
    const landing = document.getElementById('landing');
    const garden = document.getElementById('garden');
    
    landing.style.animation = 'fadeOut 0.6s ease-out forwards';
    
    setTimeout(() => {
        landing.classList.remove('active');
        landing.style.display = 'none';
        garden.classList.add('active');
        
        // Trigger scroll animations
        observeElements();
    }, 600);
}

const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// ========== OPEN LETTER ==========
let currentOpenLetter = null;

function openLetter(letterNum) {
    const letterId = 'letter-' + letterNum;
    const letterContent = document.getElementById(letterId);
    const letterCard = letterContent.parentElement;
    
    if (currentOpenLetter && currentOpenLetter !== letterContent) {
        currentOpenLetter.classList.remove('active');
        currentOpenLetter.parentElement.querySelector('.letter-envelope').style.display = 'block';
    }
    
    if (letterContent.classList.contains('active')) {
        letterContent.classList.remove('active');
        letterCard.querySelector('.letter-envelope').style.display = 'block';
        currentOpenLetter = null;
    } else {
        letterContent.classList.add('active');
        letterCard.querySelector('.letter-envelope').style.display = 'none';
        currentOpenLetter = letterContent;
        
        setTimeout(() => {
            letterCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest'
            });
        }, 100);
        
        const polaroid = letterContent.querySelector('.polaroid-photo');
        const img = polaroid.querySelector('img');
        const caption = polaroid.querySelector('.photo-caption');
        
        polaroid.onclick = function(e) {
            e.stopPropagation();
            openModal(img.src, caption.textContent);
        };
    }
    
    createSparkles(letterCard);
}

// ========== ENHANCED SPARKLE EFFECT ==========
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 15;
    const sparkleEmojis = ['✨', '💫', '⭐', '🌟'];
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + rect.width / 2 + 'px';
        sparkle.style.top = rect.top + rect.height / 2 + 'px';
        sparkle.style.fontSize = (1 + Math.random()) + 'rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        
        document.body.appendChild(sparkle);
        
        const angle = (Math.PI * 2 * i) / sparkleCount;
        const velocity = 80 + Math.random() * 120;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let opacity = 1;
        let x = rect.left + rect.width / 2;
        let y = rect.top + rect.height / 2;
        let rotation = 0;
        
        function animateSparkle() {
            opacity -= 0.018;
            x += vx * 0.02;
            y += vy * 0.02;
            rotation += 12;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.opacity = opacity;
            sparkle.style.transform = `rotate(${rotation}deg) scale(${1 + (1 - opacity) * 0.3})`;
            
            if (opacity > 0) {
                requestAnimationFrame(animateSparkle);
            } else {
                sparkle.remove();
            }
        }
        
        animateSparkle();
    }
}

// ========== MODAL FUNCTIONS ==========
function openModal(imgSrc, caption) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    
    modal.classList.add('active');
    modalImg.src = imgSrc;
    modalCaption.textContent = caption;
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('photoModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ========== FLOATING HEARTS ON CLICK ==========
document.addEventListener('click', function(e) {
    if (e.target.closest('button, .letter-envelope, .polaroid-photo, .modal')) {
        return;
    }
    
    createFloatingHeart(e.clientX, e.clientY);
});

function createFloatingHeart(x, y) {
    const hearts = ['💚', '💝', '💕', '💖', '💗'];
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (1.5 + Math.random() * 0.5) + 'rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    
    document.body.appendChild(heart);
    
    let opacity = 1;
    let currentY = y;
    let rotation = 0;
    
    function animate() {
        opacity -= 0.012;
        currentY -= 2.5;
        rotation += 4;
        
        heart.style.top = currentY + 'px';
        heart.style.opacity = opacity;
        heart.style.transform = `rotate(${rotation}deg) scale(${1 + (1 - opacity) * 0.6})`;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            heart.remove();
        }
    }
    
    animate();
}

// ========== SCROLL REVEAL ANIMATION ==========
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.letter-card, .gallery-item, .poetry-content').forEach(el => {
        observer.observe(el);
    });
}

// ========== PARALLAX EFFECT ==========
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function updateParallax() {
    const garden = document.getElementById('garden');
    if (!garden.classList.contains('active')) {
        requestAnimationFrame(updateParallax);
        return;
    }
    
    const letters = document.querySelectorAll('.letter-card:not(:has(.letter-content.active))');
    letters.forEach((letter, index) => {
        const speed = (index % 3 + 1) * 0.25;
        const x = mouseX * 8 * speed;
        const y = mouseY * 8 * speed;
        
        letter.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    requestAnimationFrame(updateParallax);
}

updateParallax();

// ========== EASTER EGGS ==========
document.querySelector('.main-title')?.addEventListener('dblclick', function() {
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const x = window.innerWidth / 2 + (Math.random() - 0.5) * 150;
            const y = window.innerHeight / 2 + (Math.random() - 0.5) * 150;
            createFloatingHeart(x, y);
        }, i * 40);
    }
});

// Triple click on quote for surprise
document.querySelector('.quote-text')?.addEventListener('click', function(e) {
    if (e.detail === 3) {
        alert('💌 May our love story continue forever! 💚');
    }
});

console.log('💌 Love Letter Garden Enhanced Edition loaded! Happy Valentine\'s Day! 💚✨');