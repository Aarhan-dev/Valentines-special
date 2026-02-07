// ================= CONFIGURATION =================
const CORRECT_PASSWORD = "241025"; // DDMMYY or DDMMYYYY (your choice)
const PINTEREST_PHOTO_ID = "980307043905892776";
const SPOTIFY_PLAYLIST_ID = "37i9dQZF1DX4pAtJteyweQ";

// ================= STATE =================
let yesScale = 1;
let noCount = 0;
let passwordAttempts = 0;
let floatingHeartsInterval = null;
let activeHearts = 0;
const MAX_HEARTS = 3; // Minimal hearts to prevent lag
const HEART_EMOJIS = ['💖', '💕', '💓', '❤️', '💗'];

// ================= NO BUTTON MESSAGES =================
const noMessages = [
  "Are you sure? 🥺",
  "Think again 💕",
  "My heart 😭",
  "You know you want to 💖",
  "Just click yes! 😘",
  "Pretty please? 🙏",
  "I'll keep asking! 💪"
];

// ================= DOM ELEMENTS =================
const elements = {
  nightModeToggle: document.getElementById("nightModeToggle"),
  yesBtn: document.getElementById("yesBtn"),
  noBtn: document.getElementById("noBtn"),
  noMsg: document.getElementById("noMsg"),
  questionScreen: document.getElementById("questionScreen"),
  loveContent: document.getElementById("loveContent"),
  typingText: document.getElementById("typingText"),
  passwordInput: document.getElementById("passwordInput"),
  passwordMessage: document.getElementById("passwordMessage"),
  passwordContainer: document.getElementById("passwordContainer"),
  hiddenPhoto: document.getElementById("hiddenPhoto"),
  secretPhoto: document.getElementById("secretPhoto"),
  unlockBtn: document.getElementById("unlockBtn"),
  photoClick: document.getElementById("photoClick"),
  photoModal: document.getElementById("photoModal"),
  zoomedPhoto: document.getElementById("zoamedPhoto"),
  closeModal: document.getElementById("closeModal"),
  miniPlayer: document.getElementById("miniPlayer"),
  spotifyPlayer: document.getElementById("spotifyPlayer"),
  lockIcon: document.querySelector(".lock-icon")
};

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

// ================= EVENTS =================
function setupEventListeners() {
  elements.nightModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("night");
  });

  elements.yesBtn.addEventListener("click", yesClicked);
  elements.noBtn.addEventListener("click", noClicked);
  elements.unlockBtn.addEventListener("click", checkPassword);

  elements.passwordInput.addEventListener("keypress", e => {
    if (e.key === "Enter") checkPassword();
  });

  elements.photoClick.addEventListener("click", openPhotoModal);
  elements.closeModal.addEventListener("click", closePhotoModal);
  
  // Click outside modal to close
  elements.photoModal.addEventListener("click", (e) => {
    if (e.target === elements.photoModal) {
      closePhotoModal();
    }
  });
}

// ================= NO CLICK =================
function noClicked() {
  yesScale += 0.2;
  elements.yesBtn.style.transform = `scale(${yesScale})`;

  elements.noMsg.textContent = noMessages[noCount % noMessages.length];

  elements.noBtn.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)`;
  elements.noBtn.style.opacity = Math.max(0.3, 1 - noCount * 0.1);

  noCount++;

  if (noCount >= 7) {
    elements.noBtn.style.display = "none";
    elements.noMsg.textContent = "Okay okay… YES it is 😌💖";
    setTimeout(yesClicked, 800);
  }
}

// ================= YES CLICK =================
function yesClicked() {
  elements.questionScreen.style.display = "none";
  elements.loveContent.style.display = "block";
  elements.loveContent.scrollIntoView({ behavior: "smooth" });

  // Start initial celebrations
  startTyping();
  startSpotifyPlayer();
  
  // Start celebrations with delays
  setTimeout(() => {
    startInitialCelebrationHearts(); // Initial burst of hearts
  }, 300);
  
  setTimeout(() => {
    startMinimalFloatingHearts(); // Constant minimal hearts
  }, 2000);
  
  setTimeout(() => {
    startConfetti();
  }, 500);
  
  setTimeout(() => {
    startFireworks();
  }, 800);
}

// ================= PASSWORD =================
function checkPassword() {
  if (elements.passwordInput.value === CORRECT_PASSWORD) {
    elements.passwordMessage.textContent = "🎉 Correct! Unlocking our special memory...";
    elements.passwordMessage.style.color = "#ffccd5";
    
    // Add animation for unlock
    setTimeout(() => {
      elements.passwordContainer.style.opacity = "0";
      elements.passwordContainer.style.transform = "translateY(-20px)";
      
      setTimeout(() => {
        elements.passwordContainer.style.display = "none";
        elements.lockIcon.style.display = "none";
        elements.hiddenPhoto.style.display = "block";

        // ✅ FIXED: Pinterest embed with proper parameters
        const pinterestEmbed = `https://assets.pinterest.com/ext/embed.html?id=${PINTEREST_PHOTO_ID}&height=520&width=236`;
        elements.secretPhoto.src = pinterestEmbed;
        
        // Add confetti celebration
        startPhotoConfetti();
        
        // Smooth scroll to photo
        setTimeout(() => {
          elements.hiddenPhoto.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }, 300);
    }, 1000);
    
    passwordAttempts = 0;
  } else {
    passwordAttempts++;
    elements.passwordMessage.textContent = `❌ Wrong password (Hint: DDMMYYYY)`;
    elements.passwordMessage.style.color = "#ff758f";
    
    // Shake animation
    elements.passwordInput.style.animation = "shake 0.5s";
    setTimeout(() => {
      elements.passwordInput.style.animation = "";
    }, 500);
    
    if (passwordAttempts >= 3) {
      elements.passwordInput.value = "";
    }
  }
}

// ================= PHOTO MODAL =================
function openPhotoModal() {
  // ✅ FIXED: Pinterest embed with proper parameters for modal
  const pinterestEmbed = `https://assets.pinterest.com/ext/embed.html?id=${PINTEREST_PHOTO_ID}&height=600&width=300`;
  elements.zoomedPhoto.src = pinterestEmbed;
  elements.photoModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closePhotoModal() {
  elements.photoModal.style.display = "none";
  document.body.style.overflow = "auto";
  
  setTimeout(() => {
    elements.zoomedPhoto.src = "";
  }, 300);
}

// ================= SPOTIFY PLAYER =================
function startSpotifyPlayer() {
  elements.miniPlayer.classList.add("show");

  // ✅ FIXED: Spotify embed URL with correct parameters
  elements.spotifyPlayer.src = 
    `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0&autoplay=1`;
}

// ================= TYPING EFFECT =================
const typingText = 
  "Hey my love 💕\nI made this just for you.\nBecause you mean everything to me 🫶";

function startTyping() {
  let i = 0;
  elements.typingText.textContent = "";
  const interval = setInterval(() => {
    elements.typingText.textContent += typingText[i++];
    if (i >= typingText.length) {
      clearInterval(interval);
      setTimeout(() => {
        elements.typingText.style.borderRight = "none";
      }, 500);
    }
  }, 45);
}

// ================= MINIMAL CONSTANT FLOATING HEARTS =================
function startMinimalFloatingHearts() {
  // Clear any existing interval first
  if (floatingHeartsInterval) {
    clearInterval(floatingHeartsInterval);
  }
  
  // Create 2-3 initial hearts
  for (let i = 0; i < Math.min(3, MAX_HEARTS); i++) {
    setTimeout(() => {
      createFloatingHeart();
    }, i * 1000);
  }
  
  // Start interval to maintain constant hearts
  floatingHeartsInterval = setInterval(() => {
    // Only create new heart if we're below max
    if (activeHearts < MAX_HEARTS) {
      createFloatingHeart();
    }
  }, 4000); // Create new heart every 4 seconds
}

// Create a single floating heart
function createFloatingHeart() {
  if (activeHearts >= MAX_HEARTS) return;
  
  activeHearts++;
  
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  
  // Random heart emoji
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  
  // Random properties - very minimal
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (20 + Math.random() * 15) + "px"; // 20-35px
  heart.style.opacity = 0.1 + Math.random() * 0.1; // 0.1-0.2 opacity (very subtle)
  heart.style.animationDuration = (15 + Math.random() * 10) + "s"; // 15-25 seconds (slow)
  heart.style.filter = `hue-rotate(${Math.random() * 60}deg) brightness(${0.9 + Math.random() * 0.2})`;
  
  document.body.appendChild(heart);
  
  // Remove after animation completes
  setTimeout(() => {
    if (heart.parentNode) {
      heart.remove();
      activeHearts = Math.max(0, activeHearts - 1);
    }
  }, 25000); // Slightly longer than animation duration
}

// ================= INITIAL CELEBRATION HEARTS =================
function startInitialCelebrationHearts() {
  // Create 5-7 hearts that fall down (more than constant ones)
  const celebrationHeartCount = 7;
  
  for (let i = 0; i < celebrationHeartCount; i++) {
    setTimeout(() => {
      createCelebrationHeart();
    }, i * 200); // Stagger creation
  }
}

function createCelebrationHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  
  // Random heart emoji
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  
  // Celebration hearts are slightly larger and faster
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (25 + Math.random() * 20) + "px"; // 25-45px
  heart.style.opacity = 0.15 + Math.random() * 0.15; // 0.15-0.3 opacity
  heart.style.animationDuration = (8 + Math.random() * 7) + "s"; // 8-15 seconds (faster)
  heart.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(${0.8 + Math.random() * 0.4})`;
  
  document.body.appendChild(heart);
  
  // Remove after animation
  setTimeout(() => {
    if (heart.parentNode) {
      heart.remove();
    }
  }, 15000);
}

// ================= CONFETTI =================
function startConfetti() {
  const colors = ['#ff4d6d', '#ff6b8b', '#ff8fab'];
  const shapes = ['❤️', '💖', '💕'];
  
  // Limited number for performance
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      if (Math.random() > 0.5) {
        confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.fontSize = (15 + Math.random() * 10) + 'px'; // Smaller
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (5 + Math.random() * 5) + 'px'; // Smaller
        confetti.style.height = (5 + Math.random() * 5) + 'px'; // Smaller
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      }
      
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-50px';
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (confetti.parentNode) confetti.remove();
      }, 5000);
    }, i * 50); // Slower creation
  }
}

// ================= PHOTO CONFETTI =================
function startPhotoConfetti() {
  const colors = ['#ff4d6d', '#ff6b8b', '#ff8fab'];
  const shapes = ['❤️', '💖', '💕'];
  
  const photoCard = document.getElementById('photoCard');
  const rect = photoCard.getBoundingClientRect();
  
  // Even fewer for photo reveal
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'photo-confetti';
      
      if (Math.random() > 0.5) {
        confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.fontSize = (12 + Math.random() * 12) + 'px';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (6 + Math.random() * 6) + 'px';
        confetti.style.height = (6 + Math.random() * 6) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      }
      
      confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
      confetti.style.top = (rect.top - 50) + 'px';
      confetti.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (confetti.parentNode) confetti.remove();
      }, 4000);
    }, i * 80); // Much slower creation
  }
}

// ================= FIREWORKS =================
function startFireworks() {
  const duration = 2500; // Shorter duration
  const startTime = performance.now();
  let lastBurst = 0;
  let fireworkCount = 0;
  const MAX_FIREWORKS = 20; // Even fewer

  function createBurst() {
    if (fireworkCount >= MAX_FIREWORKS) return;
    
    const x = Math.random() * innerWidth;
    const y = Math.random() * innerHeight * 0.5;
    const particles = 8; // Fewer particles

    for (let i = 0; i < particles; i++) {
      const p = document.createElement("div");
      p.className = "firework";
      p.style.background = `hsl(${Math.random()*360},100%,70%)`;
      document.body.appendChild(p);

      let angle = Math.random() * Math.PI * 2;
      let speed = Math.random() * 1.5 + 1; // Slower
      let px = x, py = y, life = 1;

      function animate() {
        px += Math.cos(angle) * speed;
        py += Math.sin(angle) * speed;
        life -= 0.015; // Slower fade
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
    if (now - startTime > duration) return;
    if (now - lastBurst > 800 && fireworkCount < MAX_FIREWORKS) { // Less frequent
      createBurst();
      lastBurst = now;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ================= PERFORMANCE OPTIMIZATION =================
// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// Player visibility on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
  if (!elements.miniPlayer.classList.contains('show')) return;
  
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop) {
    elements.miniPlayer.style.opacity = '0.7';
    elements.miniPlayer.style.transform = 'translateX(-50%) translateY(-5px)';
  } else {
    elements.miniPlayer.style.opacity = '1';
    elements.miniPlayer.style.transform = 'translateX(-50%) translateY(0)';
  }
  lastScrollTop = scrollTop;
});

// Clean up when page is hidden
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    if (floatingHeartsInterval) {
      clearInterval(floatingHeartsInterval);
      floatingHeartsInterval = null;
    }
  } else if (elements.loveContent.style.display !== 'none') {
    // Restart hearts if love content is shown
    setTimeout(() => {
      startMinimalFloatingHearts();
    }, 1000);
  }
});

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

// Reset timer on interaction
document.addEventListener('mousemove', resetPlayerTimer);
document.addEventListener('touchstart', resetPlayerTimer);
document.addEventListener('scroll', resetPlayerTimer);
