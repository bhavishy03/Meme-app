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
// RANDOM MEME FUNCTION
// =====================

async function loadMeme() {
    try {
        const res = await fetch("https://meme-api.com/gimme");
        const data = await res.json();

        memeImg.src = data.url;
        captionTitle.textContent = data.title;

    } catch (err) {
        console.log("API Error:", err);
    }
}

loadMeme();


// =====================
// SWIPE (TOUCH + DESKTOP)
// =====================

let startY = 0;

// MOBILE
document.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let endY = e.changedTouches[0].clientY;
    checkSwipe(startY, endY);
});

// DESKTOP
let mouseDown = false;
let mouseStartY = 0;

document.addEventListener("mousedown", (e) => {
    mouseDown = true;
    mouseStartY = e.clientY;
});

document.addEventListener("mouseup", (e) => {
    if (!mouseDown) return;
    mouseDown = false;

    checkSwipe(mouseStartY, e.clientY);
});

function checkSwipe(start, end) {
    let diff = start - end;

    if (diff > 50) loadMeme();     // Swipe UP
    if (diff < -50) loadMeme();    // Swipe DOWN
}


// =====================
// LIKE TOGGLE
// =====================

let liked = false;

likeBox.addEventListener("click", () => {
    liked = !liked;
    likeBox.innerHTML = liked ? "❤️" : "🤍";
});
