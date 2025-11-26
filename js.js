// =====================
// ELEMENT SELECTORS
// =====================

const reelContainer = document.querySelector(".reel-container");
const memeImg = document.getElementById("meme-img");
const iconBoxes = document.querySelectorAll(".icon-box");

const likeBox = iconBoxes[0];
const commentBox = iconBoxes[1];
const saveBox = iconBoxes[2];

const captionTitle = document.querySelector(".bottom-box h3");


// =====================
// RANDOM MEME FUNCTION (Smooth Animation)
// =====================

async function loadMeme() {
    try {
        // Fade-out animation
        memeImg.classList.add("fade");

        const res = await fetch("https://meme-api.com/gimme");
        const data = await res.json();

        setTimeout(() => {
            memeImg.src = data.url;
            captionTitle.textContent = data.title;
            memeImg.classList.remove("fade"); // Fade-in
        }, 200);

    } catch (err) {
        console.log("API Error:", err);
    }
}

// First Meme Load
loadMeme();


// =====================
// IMPROVED SWIPE (Mobile + Desktop)
// =====================

let startY = 0;
let swipeCooldown = false;

function safeLoadMeme() {
    if (swipeCooldown) return;

    swipeCooldown = true;
    loadMeme();

    setTimeout(() => {
        swipeCooldown = false;
    }, 400); // prevents spam
}

// MOBILE SWIPE
document.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;

    if (diff > 120) safeLoadMeme(); // Swipe UP only
});

// DESKTOP SWIPE
let mouseStartY = 0;
let mouseDown = false;

document.addEventListener("mousedown", (e) => {
    mouseDown = true;
    mouseStartY = e.clientY;
});

document.addEventListener("mouseup", (e) => {
    if (!mouseDown) return;
    mouseDown = false;

    let diff = mouseStartY - e.clientY;

    if (diff > 120) safeLoadMeme(); // Swipe UP
});


// =====================
// LIKE TOGGLE (With pop animation)
// =====================

let liked = false;

likeBox.addEventListener("click", () => {
    liked = !liked;
    likeBox.innerHTML = liked ? "❤️" : "🤍";

    likeBox.classList.add("like-anim");
    setTimeout(() => likeBox.classList.remove("like-anim"), 150);
});
