// Configuration
const CORRECT_PASSWORD = "241025"; // Change to your anniversary (DDMMYYYY)
const PINTEREST_PHOTO_ID = "980307043905892776";

// State variables
let yesScale = 1;
let noCount = 0;
let passwordAttempts = 0;
let floatingHeartsInterval = null;
let activeHearts = 0;
const MAX_HEARTS = 3;

// Messages for NO button
const noMessages = [
    "Are you sure? 🥺",
    "Think again 💕", 
    "My heart 😭",
    "You know you want to 💖",
    "Just click yes! 😘",
    "Pretty please? 🙏",
    "I'll keep asking! 💪"
];

// DOM Elements
const elements = {
    nightModeToggle: document.getElementById('nightModeToggle'),
    yesBtn: document.getElementById('yesBtn'),
    noBtn: document.getElementById('noBtn'),
    noMsg: document.getElementById('noMsg'),
    questionScreen: document.getElementById('questionScreen'),
    loveContent: document.getElementById('loveContent'),
    typingText: document.getElementById('typingText'),
    passwordInput: document.getElementById('passwordInput'),
    passwordMessage: document.getElementById('passwordMessage'),
    passwordContainer: document.getElementById('passwordContainer'),
    hiddenPhoto: document.getElementById('hiddenPhoto'),
    secretPhoto: document.getElementById('secretPhoto'),
    unlockBtn: document.getElementById('unlockBtn'),
    photoClick: document.getElementById('photoClick'),
    photoModal: document.getElementById('photoModal'),
    zoomedPhoto: document.getElementById('zoomedPhoto'),
    closeModal: document.getElementById('closeModal'),
    miniPlayer: document.getElementById('miniPlayer'),
    spotifyPlayer: document.getElementById('spotifyPlayer'),
    lockIcon: document.querySelector('.lock-icon')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Night mode toggle
    elements.nightModeToggle.addEventListener('change', toggleNightMode);
    
    // Main buttons
    elements.yesBtn.addEventListener('click', yesClicked);
    elements.noBtn.addEventListener('click', noClicked);
    
    // Password functionality
    elements.unlockBtn.addEventListener('click', checkPassword);
    elements.passwordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Photo modal
    elements.photoClick.addEventListener('click', openPhotoModal);
    elements.closeModal.addEventListener('click', closePhotoModal);
    elements.photoModal.addEventListener('click', (event) => {
        if (event.target === elements.photoModal) {
            closePhotoModal();
        }
    });
    
    // Spotify player visibility
    window.addEventListener('scroll', handlePlayerScroll);
    document.addEventListener('mousemove', resetPlayerTimer);
    document.addEventListener('touchstart', resetPlayerTimer);
    document.addEventListener('scroll', resetPlayerTimer);
    
    // Performance optimization
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// Night mode toggle
function toggleNightMode() {
    document.body.classList.toggle('night');
}

// NO button clicked
function noClicked() {
    // Increase YES button size
    yesScale += 0.2;
    elements.yesBtn.style.transform = `scale(${yesScale})`;
    
    // Show message
    elements.noMsg.textContent = noMessages[noCount % noMessages.length];
    
    // Move NO button randomly
    const randomX = Math.random() * 40 - 20;
    const randomY = Math.random() * 40 - 20;
    elements.noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    // Make NO button slightly transparent
    elements.noBtn.style.opacity = Math.max(0.3, 1 - (noCount * 0.1));
    
    noCount++;
    
    // Auto-click YES after 7 NOs
    if (noCount >= 7) {
        elements.noBtn.style.display = 'none';
        elements.noMsg.textContent = "Okay, I'll click YES for you! 😉";
        setTimeout(() => yesClicked(), 1000);
    }
    
    // Create a small heart animation
    createHeartAnimation();
}

// YES button clicked
function yesClicked() {
    // Hide question screen, show love content
    elements.questionScreen.style.display = 'none';
    elements.loveContent.style.display = 'block';
    
    // Scroll to love content
    elements.loveContent.scrollIntoView({behavior: 'smooth'});
    
    // Start all celebrations
    startTyping();
    startConfetti();
    startFireworks();
    
    // Show and start mini player
    setTimeout(() => {
        startSpotifyPlayer();
    }, 500);
    
    // Start minimal floating hearts
    startMinimalFloatingHearts();
}

// Check password
function checkPassword() {
    if (elements.passwordInput.value === CORRECT_PASSWORD) {
        // Correct password
        elements.passwordMessage.textContent = "🎉 Correct! Unlocking our special memory...";
        elements.passwordMessage.style.color = "#ffccd5";
        
        // Hide password section
        setTimeout(() => {
            elements.passwordContainer.style.opacity = "0";
            elements.passwordContainer.style.transform = "translateY(-20px)";
            
            // Show the hidden photo
            setTimeout(() => {
                elements.passwordContainer.style.display = "none";
                elements.lockIcon.style.display = "none";
                elements.hiddenPhoto.style.display = "block";
                
                // Load the Pinterest photo
                elements.secretPhoto.src = `https://assets.pinterest.com/ext/embed.html?id=${980307043905892776}`;
                
                // Add photo confetti celebration
                startPhotoConfetti();
                
                // Smooth scroll to the photo
                setTimeout(() => {
                    elements.hiddenPhoto.scrollIntoView({behavior: 'smooth'});
                }, 300);
            }, 300);
        }, 1000);
        
        passwordAttempts = 0;
    } else {
        // Wrong password
        passwordAttempts++;
        elements.passwordMessage.textContent = `❌ Incorrect password. Hint: Our anniversary (DDMMYYYY)`;
        elements.passwordMessage.style.color = "#ff758f";
        
        // Shake animation for wrong password
        elements.passwordInput.style.animation = "shake 0.5s";
        setTimeout(() => {
            elements.passwordInput.style.animation = "";
        }, 500);
        
        // Clear input after a few attempts
        if (passwordAttempts >= 3) {
            elements.passwordInput.value = "";
        }
    }
}

// Open photo modal
function openPhotoModal() {
    elements.zoomedPhoto.src = `https://assets.pinterest.com/ext/embed.html?id=${PINTEREST_PHOTO_ID}`;
    elements.photoModal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Close photo modal
function closePhotoModal() {
    elements.photoModal.style.display = "none";
    document.body.style.overflow = "auto";
    
    setTimeout(() => {
        elements.zoomedPhoto.src = "";
    }, 300);
}

// Minimal Floating Hearts
function startMinimalFloatingHearts() {
    // Clear any existing interval
    if (floatingHeartsInterval) {
        clearInterval(floatingHeartsInterval);
    }
    
    // Create initial hearts (max 3)
    for (let i = 0; i < Math.min(3, MAX_HEARTS); i++) {
        setTimeout(() => {
            createFloatingHeart(i * 1000);
        }, i * 1000);
    }
    
    // Keep creating hearts periodically but maintain limit
    floatingHeartsInterval = setInterval(() => {
        if (activeHearts < MAX_HEARTS) {
            createFloatingHeart(0);
        }
    }, 3000);
}

function createFloatingHeart(delay = 0) {
    setTimeout(() => {
        if (activeHearts >= MAX_HEARTS) return;
        
        activeHearts++;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        // Random heart emoji
        const hearts = ['💖', '💕', '💓'];
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Random properties
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (18 + Math.random() * 10) + 'px';
        heart.style.animationDuration = (12 + Math.random() * 8) + 's';
        
        document.body.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
                activeHearts = Math.max(0, activeHearts - 1);
            }
        }, 15000);
    }, delay);
}

// Small heart animation for NO clicks
function createHeartAnimation() {
    const heart = document.createElement('div');
    heart.textContent = '💔';
    heart.style.position = 'fixed';
    heart.style.fontSize = '24px';
    heart.style.zIndex = '1000';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'fadeOut 1s ease forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, 1000);
}

// Special photo confetti
function startPhotoConfetti() {
    const colors = ['#ff4d6d', '#ff6b8b', '#ff8fab'];
    const shapes = ['❤️', '💖', '💕'];
    
    const photoCard = document.getElementById('photoCard');
    const rect = photoCard.getBoundingClientRect();
    
    // Only 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'photo-confetti';
            
            if (Math.random() > 0.5) {
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.fontSize = (15 + Math.random() * 15) + 'px';
                confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            } else {
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.width = (8 + Math.random() * 8) + 'px';
                confetti.style.height = (8 + Math.random() * 8) + 'px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            // Position relative to photo card
            confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
            confetti.style.top = (rect.top - 50) + 'px';
            confetti.style.animationDuration = (1.5 + Math.random() * 2) + 's';
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 4000);
        }, i * 60);
    }
}

// Confetti Function
function startConfetti() {
    const colors = ['#ff4d6d', '#ff6b8b', '#ff8fab'];
    const shapes = ['❤️', '💖', '💕'];
    
    // Only 75 confetti pieces
    for (let i = 0; i < 75; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            
            // Randomly decide if it's a shape or colored square
            if (Math.random() > 0.5) {
                confetti.className = 'confetti';
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.fontSize = (18 + Math.random() * 12) + 'px';
                confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            } else {
                confetti.className = 'firework';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.width = (6 + Math.random() * 6) + 'px';
                confetti.style.height = (6 + Math.random() * 6) + 'px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            // Random position and animation
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 5000);
        }, i * 40);
    }
}

// Spotify Player
function startSpotifyPlayer() {
    // Show the mini player with animation
    elements.miniPlayer.classList.add('show');
    
    // Set the playlist
    elements.spotifyPlayer.src = "https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID?utm_source=generator&autoplay=1";
    
    // Make player visible and start at top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Typing Effect
const typingText = `Hey my love 💕
I made this just for you.
because you mean everything to me 🫶`;

function startTyping() {
    let i = 0;
    elements.typingText.textContent = "";
    const t = setInterval(() => {
        elements.typingText.textContent += typingText[i++];
        if (i >= typingText.length) {
            clearInterval(t);
            setTimeout(() => {
                elements.typingText.style.animation = "none";
                elements.typingText.style.borderRight = "none";
            }, 500);
        }
    }, 45);
}

// Fireworks (Optimized)
function startFireworks() {
    const duration = 3000;
    const startTime = performance.now();
    let lastBurst = 0;
    let fireworkCount = 0;
    const MAX_FIREWORKS = 50;

    function createBurst() {
        if (fireworkCount >= MAX_FIREWORKS) return;
        
        const x = Math.random() * innerWidth;
        const y = Math.random() * innerHeight * 0.5;
        const particles = 15;

        for (let i = 0; i < particles; i++) {
            const p = document.createElement("div");
            p.className = "firework";
            p.style.background = `hsl(${Math.random()*360},100%,70%)`;
            document.body.appendChild(p);

            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 2 + 1.5;
            let px = x, py = y, life = 1;

            function animate() {
                px += Math.cos(angle) * speed;
                py += Math.sin(angle) * speed;
                life -= 0.025;
                p.style.transform = `translate(${px}px, ${py}px)`;
                p.style.opacity = life;
                if (life > 0) {
                    requestAnimationFrame(animate);
                } else {
                    p.remove();
                    fireworkCount--;
                }
            }
            fireworkCount++;
            animate();
        }
    }

    function loop(now) {
        if (now - startTime > duration) {
            return;
        }

        if (now - lastBurst > 500 && fireworkCount < MAX_FIREWORKS) {
            createBurst();
            lastBurst = now;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

// Player visibility on scroll
let lastScrollTop = 0;
function handlePlayerScroll() {
    if (!elements.miniPlayer.classList.contains('show')) return;
    
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // Scrolling down - hide player slightly
        elements.miniPlayer.style.opacity = '0.7';
        elements.miniPlayer.style.transform = 'translateX(-50%) translateY(-5px)';
    } else {
        // Scrolling up - show player
        elements.miniPlayer.style.opacity = '1';
        elements.miniPlayer.style.transform = 'translateX(-50%) translateY(0)';
    }
    lastScrollTop = scrollTop;
}

// Auto-hide player when not in use
let playerTimeout;
function resetPlayerTimer() {
    clearTimeout(playerTimeout);
    if (elements.miniPlayer.classList.contains('show')) {
        playerTimeout = setTimeout(() => {
            elements.miniPlayer.style.opacity = '0.8';
        }, 3000);
    }
}

// Performance optimization
function handleVisibilityChange() {
    if (document.hidden) {
        // Clear floating hearts interval when page is not visible
        if (floatingHeartsInterval) {
            clearInterval(floatingHeartsInterval);
            floatingHeartsInterval = null;
        }
    } else if (elements.loveContent.style.display !== 'none') {
        // Restart hearts if love content is shown
        startMinimalFloatingHearts();
    }
}