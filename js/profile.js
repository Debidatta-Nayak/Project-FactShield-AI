// ==========================================
// FACTSHIELD AI - PROFILE PAGE
// ==========================================

// Authentication is handled by js/flask-auth.js.
// The Flask session is the source of truth.

async function initializeProfile() {

    const authenticated = await requireLogin("profile.html");

    if (!authenticated) {
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        return;
    }

    displayUser(user);
    loadStatistics();
}


// ==========================================
// DISPLAY USER INFORMATION
// ==========================================

function displayUser(user) {

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const displayName = document.getElementById("displayName");
    const displayEmail = document.getElementById("displayEmail");

    if (userName) {
        userName.textContent = user.fullName || "User";
    }

    if (userEmail) {
        userEmail.textContent = user.email || "";
    }

    if (displayName) {
        displayName.textContent = user.fullName || "-";
    }

    if (displayEmail) {
        displayEmail.textContent = user.email || "-";
    }
}


// ==========================================
// LOGOUT BUTTONS
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");
const logoutBottom = document.getElementById("logoutBottom");

if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
}

if (logoutBottom) {
    logoutBottom.addEventListener("click", logoutUser);
}


// ==========================================
// STATISTICS
// ==========================================

function loadStatistics() {

    const statsData = localStorage.getItem("stats");

    let stats;

    if (statsData) {
        try {
            stats = JSON.parse(statsData);
        } catch (error) {
            stats = null;
        }
    }

    if (!stats) {
        stats = {
            newsCount: 0,
            imageCount: 0,
            videoCount: 0
        };

        localStorage.setItem("stats", JSON.stringify(stats));
    }

    const newsCount = document.getElementById("newsCount");
    const imageCount = document.getElementById("imageCount");
    const videoCount = document.getElementById("videoCount");

    if (newsCount) {
        newsCount.textContent = stats.newsCount || 0;
    }

    if (imageCount) {
        imageCount.textContent = stats.imageCount || 0;
    }

    if (videoCount) {
        videoCount.textContent = stats.videoCount || 0;
    }
}


// ==========================================
// START PROFILE
// ==========================================

initializeProfile();
