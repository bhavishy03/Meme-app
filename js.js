// =====================
// SELECTORS
// =====================
const mediaContainer = document.getElementById("media-container");
const captionTitle = document.querySelector(".bottom-box h3");
const likeBox = document.querySelector(".icon-box");

let memeQueue = [];
let isLoading = false;
const usedUrls = new Set(); // ← Repeat bilkul zero rahega

// =====================
// FETCH FROM PORNREELS API (Zero repeat + Vertical videos)
// =====================
async function fetchPornReel() {
    try {
        const res = await fetch("https://pornreels.api.dev/api/v1/random");
        if (!res.ok) throw new Error("API down");

        const data = await res.json();

        const videoUrl = data.videoUrl || data.url;
        const title = data.title || data.description || "Hot Reel 🔥";

        // Repeat check
        if (videoUrl && !usedUrls.has(videoUrl)) {
            usedUrls.add(videoUrl);
            memeQueue.push({ url: videoUrl, title });
        }

        // Agar queue khali hai to turant load karo
        if (memeQueue.length === 1) loadNext();

        // Background mein aur videos preload karte raho
        if (memeQueue.length < 8) {
            setTimeout(fetchPornReel, 800);
        }

    } catch (err) {
        console.log("PornReels down → backup try kar raha...");
        // Backup API (kabhi kabhi zaroori)
        fetch("https://nsfwxxx.api.dev/video")
            .then(r => r.json())
            .then(d => {
                if (d.video && !usedUrls.has(d.video)) {
                    usedUrls.add(d.video);
                    memeQueue.push({ url: d.video, title: "NSFW 🔥" });
                    if (memeQueue.length === 1) loadNext();
                }
            });
    }
}

// =====================
// LOAD NEXT VIDEO
// =====================
function loadNext() {
    if (isLoading || memeQueue.length === 0) return;
    isLoading = true;

    const item = memeQueue.shift();
    
    mediaContainer.classList.add("fade");

    setTimeout(() => {
        mediaContainer.innerHTML = `
            <video 
                class="meme-media" 
                src="${item.url}" 
                autoplay 
                muted 
                loop 
                playsinline>
            </video>
        `;
        captionTitle.textContent = item.title;

        mediaContainer.classList.remove("fade");
        isLoading = false;

        // Aur videos preload karo
        if (memeQueue.length < 5) fetchPornReel();
    }, 250);
}

// =====================
// SWIPE TO NEXT (Mobile + Desktop)
// =====================
let startY = 0;
let cooldown = false;

function nextVideo() {
    if (cooldown) return;
    cooldown = true;
    loadNext();
    setTimeout(() => cooldown = false, 500);
}

// Touch
document.addEventListener("touchstart", e => startY = e.touches[0].clientY);
document.addEventListener("touchend", e => {
    if (startY - e.changedTouches[0].clientY > 100) nextVideo();
});

// Mouse
document.addEventListener("mousedown", e => startY = e.clientY);
document.addEventListener("mouseup", e => {
    if (startY - e.clientY > 100) nextVideo();
});

// =====================
// LIKE BUTTON
// =====================
let liked = false;
likeBox.addEventListener("click", () => {
    liked = !liked;
    likeBox.innerHTML = liked ? "❤️" : "🤍";
    likeBox.classList.add("like-anim");
    setTimeout(() => likeBox.classList.remove("like-anim"), 400);
});

// =====================
// START KAR DO!
// =====================
fetchPornReel(); // Pehla video load
fetchPornReel(); // Background mein aur load karo