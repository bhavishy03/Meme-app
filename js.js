// =====================
// ELEMENT SELECTORS
// =====================
const reelContainer = document.querySelector(".reel-container");
const mediaContainer = document.getElementById("media-container"); // Naya container banaya hai
const captionTitle = document.querySelector(".bottom-box h3");
const likeBox = document.querySelectorAll(".icon-box")[0];

let memeQueue = []; // Preloaded memes
let isLoading = false;

// =====================
// FETCH MULTIPLE MEMES AT ONCE (No repeat + Video support)
// =====================
async function fetchMemes(count = 15) {
    try {
        const res = await fetch(`https://meme-api.com/gimme/${count}`);
        const data = await res.json();
        memeQueue = [...memeQueue, ...data.memes.filter(m => m.url)]; // Valid URLs only
    } catch (err) {
        console.log("API Error:", err);
    }
}

// =====================
// LOAD NEXT MEME (Image ya Video)
// =====================
function loadNextMeme() {
    if (isLoading || memeQueue.length === 0) return;
    isLoading = true;

    const meme = memeQueue.shift(); // Queue se nikaalo

    // Fade out
    mediaContainer.classList.add("fade");

    setTimeout(() => {
        mediaContainer.innerHTML = ''; // Clear previous

        let mediaElement;
        if (meme.url.endsWith('.mp4') || meme.url.includes('.gifv')) {
            // VIDEO
            mediaElement = document.createElement('video');
            mediaElement.src = meme.url;
            mediaElement.autoplay = true;
            mediaElement.muted = true;
            mediaElement.loop = true;
            mediaElement.playsInline = true;
            mediaElement.className = "meme-media";
        } else {
            // IMAGE
            mediaElement = document.createElement('img');
            mediaElement.src = meme.url;
            mediaElement.className = "meme-media";
        }

        mediaElement.alt = meme.title;
        captionTitle.textContent = meme.title || "Sexy Vibes 🔥";

        mediaContainer.appendChild(mediaElement);
        mediaContainer.classList.remove("fade");

        isLoading = false;

        // Agar queue khatam hone wala hai → aur fetch kar lo
        if (memeQueue.length < 5) {
            fetchMemes(15);
        }
    }, 250);
}

// Initial load
fetchMemes(15).then(() => {
    setTimeout(loadNextMeme, 500);
});

// =====================
// SWIPE CONTROLS (Mobile + Desktop)
// =====================
let startY = 0;
let swipeCooldown = false;

function safeNext() {
    if (swipeCooldown) return;
    swipeCooldown = true;
    loadNextMeme();
    setTimeout(() => swipeCooldown = false, 500);
}

// Touch Events
document.addEventListener("touchstart", e => startY = e.touches[0].clientY);
document.addEventListener("touchend", e => {
    const diff = startY - e.changedTouches[0].clientY;
    if (diff > 100) safeNext();
});

// Mouse Events (Desktop)
let mouseStartY = 0;
document.addEventListener("mousedown", e => mouseStartY = e.clientY);
document.addEventListener("mouseup", e => {
    const diff = mouseStartY - e.clientY;
    if (diff > 100) safeNext();
});

// =====================
// LIKE ANIMATION
// =====================
let liked = false;
likeBox.addEventListener("click", () => {
    liked = !liked;
    likeBox.innerHTML = liked ? "❤️" : "🤍";
    likeBox.classList.add("like-anim");
    setTimeout(() => likeBox.classList.remove("like-anim"), 300);
});
