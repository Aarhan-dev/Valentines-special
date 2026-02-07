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
const MAX_HEARTS = 3;

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
  zoomedPhoto: document.getElementById("zoomedPhoto"),
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

  startTyping();
  startSpotifyPlayer();
  startMinimalFloatingHearts();
}

// ================= PASSWORD =================
function checkPassword() {
  if (elements.passwordInput.value === CORRECT_PASSWORD) {
    elements.passwordContainer.style.display = "none";
    elements.lockIcon.style.display = "none";
    elements.hiddenPhoto.style.display = "block";

    // ✅ WORKING PINTEREST EMBED
    elements.secretPhoto.src =
      `https://assets.pinterest.com/ext/embed.html?id=${PINTEREST_PHOTO_ID}`;
  } else {
    passwordAttempts++;
    elements.passwordMessage.textContent = "❌ Wrong password (DDMMYYYY)";
  }
}

// ================= PHOTO MODAL =================
function openPhotoModal() {
  elements.zoomedPhoto.src =
    `https://assets.pinterest.com/ext/embed.html?id=${PINTEREST_PHOTO_ID}`;
  elements.photoModal.style.display = "flex";
}

function closePhotoModal() {
  elements.photoModal.style.display = "none";
  elements.zoomedPhoto.src = "";
}

// ================= SPOTIFY PLAYER =================
function startSpotifyPlayer() {
  elements.miniPlayer.classList.add("show");

  // ✅ WORKING SPOTIFY EMBED
  elements.spotifyPlayer.src =
    `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?autoplay=1`;
}

// ================= TYPING EFFECT =================
const typingText =
  "Hey my love 💕\nI made this just for you.\nBecause you mean everything to me 🫶";

function startTyping() {
  let i = 0;
  elements.typingText.textContent = "";
  const interval = setInterval(() => {
    elements.typingText.textContent += typingText[i++];
    if (i >= typingText.length) clearInterval(interval);
  }, 45);
}

// ================= FLOATING HEARTS =================
function startMinimalFloatingHearts() {
  if (floatingHeartsInterval) clearInterval(floatingHeartsInterval);

  floatingHeartsInterval = setInterval(() => {
    if (activeHearts >= MAX_HEARTS) return;

    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = ["💖", "💕", "💓"][Math.floor(Math.random() * 3)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = "22px";

    document.body.appendChild(heart);
    activeHearts++;

    setTimeout(() => {
      heart.remove();
      activeHearts--;
    }, 12000);
  }, 3000);
}
