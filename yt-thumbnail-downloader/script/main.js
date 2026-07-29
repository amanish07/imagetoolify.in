const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
menuBtn.onclick = () => {
    menuBtn.classList.toggle("active");
    navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
};

const urlInput = document.getElementById("url");
const fetchBtn = document.getElementById("fetchBtn");
const previewDiv = document.getElementById("preview");
const errorDiv = document.getElementById("error");
const thumbnailImg = document.getElementById("thumbnail");
const downloadBtn = document.getElementById("downloadBtn");
const copyUrlBtn = document.getElementById("copyUrlBtn");
const loaderDiv = document.getElementById("loader");
const qualitySelector = document.getElementById("qualitySelector");
const resolutionBadge = document.getElementById("resolutionBadge");

const videoTitleEl = document.getElementById("videoTitle");
const channelNameEl = document.getElementById("channelName");
const channelIconEl = document.getElementById("channelIcon");
const copyTitleBtn = document.getElementById("copyTitleBtn");
const copyChannelBtn = document.getElementById("copyChannelBtn");

let currentVideoId = "";
let currentQuality = "maxres";
let currentThumbnailUrl = "";
let currentVideoData = { title: "", channel: "" };

// EXTRACT VIDEO ID (INCLUDES LIVE STREAMS & SHORTS)
function extractVideoId(url) {
    if (!url) return "";
    let cleanUrl = url.trim();

    // Regex supporting regular videos, shorts, live streams, embed links
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    if (match && match[2].length === 11) return match[2];

    try {
        const parsed = new URL(cleanUrl);
        if (parsed.hostname.includes("youtube.com")) {
            if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2];
            if (parsed.pathname.startsWith("/live/")) return parsed.pathname.split("/")[2]; // Live Stream Support
            return parsed.searchParams.get("v");
        } else if (parsed.hostname === "youtu.be") {
            return parsed.pathname.slice(1);
        }
    } catch (e) { }
    return "";
}

async function fetchVideoMetaFast(videoId) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const response = await fetch(oembedUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error();
        const data = await response.json();
        return {
            title: data.title || "YouTube Video",
            channel: data.author_name || "YouTube Channel"
        };
    } catch (err) {
        return { title: "YouTube Video", channel: "YouTube Channel" };
    }
}

function buildThumbUrl(videoId, quality) {
    if (quality === "maxres") return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        let timeout = setTimeout(() => { img.src = ""; resolve(false); }, 2000);
        img.onload = () => { clearTimeout(timeout); resolve(true); };
        img.onerror = () => { clearTimeout(timeout); resolve(false); };
        img.src = url;
    });
}

async function getBestAvailableUrl(videoId, preferredQuality) {
    const order = ["maxres", "hqdefault", "mqdefault", "default"];
    let startIndex = order.indexOf(preferredQuality);
    if (startIndex === -1) startIndex = 0;

    for (let i = startIndex; i < order.length; i++) {
        const qual = order[i];
        const testUrl = buildThumbUrl(videoId, qual);
        const exists = await imageExists(testUrl);
        if (exists) return { url: testUrl, quality: qual };
    }
    return { url: buildThumbUrl(videoId, "default"), quality: "default" };
}

async function loadVideoAndThumbnail() {
    const rawUrl = urlInput.value.trim();
    const videoId = extractVideoId(rawUrl);

    if (!videoId) {
        previewDiv.style.display = "none";
        errorDiv.style.display = "block";
        qualitySelector.style.display = "none";
        loaderDiv.style.display = "none";
        return false;
    }

    currentVideoId = videoId;
    errorDiv.style.display = "none";
    loaderDiv.style.display = "flex";
    previewDiv.style.display = "none";
    qualitySelector.style.display = "none";

    videoTitleEl.textContent = "Loading video...";
    channelNameEl.textContent = "Please wait";

    try {
        const [thumbResult, meta] = await Promise.all([
            getBestAvailableUrl(videoId, currentQuality),
            fetchVideoMetaFast(videoId)
        ]);

        const { url, quality: finalQual } = thumbResult;
        currentThumbnailUrl = url;
        thumbnailImg.src = currentThumbnailUrl;

        currentVideoData = meta;
        videoTitleEl.textContent = meta.title;
        channelNameEl.textContent = meta.channel;
        const firstChar = meta.channel.charAt(0).toUpperCase();
        channelIconEl.innerHTML = firstChar.match(/[A-Z]/) ? firstChar : '<i class="fa-solid fa-video"></i>';

        let qualityLabel = "";
        if (finalQual === "maxres") qualityLabel = '<i class="fa-solid fa-star"></i> Max Quality (HD/4K)';
        else if (finalQual === "hqdefault") qualityLabel = '<i class="fa-solid fa-film"></i> High Quality (480p)';
        else if (finalQual === "mqdefault") qualityLabel = '<i class="fa-solid fa-image"></i> Medium Quality';
        else qualityLabel = '<i class="fa-solid fa-mobile-screen-button"></i> Standard Quality';
        resolutionBadge.innerHTML = qualityLabel;

        document.querySelectorAll(".quality-btn").forEach(btn => {
            btn.classList.remove("active");
            if (btn.getAttribute("data-quality") === finalQual) {
                btn.classList.add("active");
                currentQuality = finalQual;
            }
        });

        qualitySelector.style.display = "flex";
        previewDiv.style.display = "block";
        loaderDiv.style.display = "none";
        return true;
    } catch (err) {
        errorDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed to load. Please check URL and try again.';
        errorDiv.style.display = "block";
        previewDiv.style.display = "none";
        loaderDiv.style.display = "none";
        qualitySelector.style.display = "none";
        return false;
    }
}

async function switchQuality(qualityKey) {
    if (!currentVideoId) return;
    currentQuality = qualityKey;
    loaderDiv.style.display = "flex";
    previewDiv.style.display = "none";

    try {
        const { url, quality: finalQual } = await getBestAvailableUrl(currentVideoId, qualityKey);
        currentThumbnailUrl = url;
        thumbnailImg.src = currentThumbnailUrl;

        let qualityLabel = "";
        if (finalQual === "maxres") qualityLabel = '<i class="fa-solid fa-star"></i> Max Quality (HD/4K)';
        else if (finalQual === "hqdefault") qualityLabel = '<i class="fa-solid fa-film"></i> High Quality (480p)';
        else if (finalQual === "mqdefault") qualityLabel = '<i class="fa-solid fa-image"></i> Medium Quality';
        else qualityLabel = '<i class="fa-solid fa-mobile-screen-button"></i> Standard Quality';
        resolutionBadge.innerHTML = qualityLabel;

        document.querySelectorAll(".quality-btn").forEach(btn => {
            btn.classList.remove("active");
            if (btn.getAttribute("data-quality") === finalQual) btn.classList.add("active");
        });

        previewDiv.style.display = "block";
        loaderDiv.style.display = "none";
    } catch (e) {
        loaderDiv.style.display = "none";
        errorDiv.textContent = "Failed to switch quality";
        errorDiv.style.display = "block";
        setTimeout(() => errorDiv.style.display = "none", 1500);
    }
}

// GUARANTEED IN-PAGE DOWNLOAD USING CANVAS (NO POPUPS)
function downloadThumbnail() {
    if (!currentThumbnailUrl) { showToast("No thumbnail loaded"); return; }
    showToast("Downloading...");

    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Use loaded img natural dimensions
        canvas.width = thumbnailImg.naturalWidth || 1280;
        canvas.height = thumbnailImg.naturalHeight || 720;

        ctx.drawImage(thumbnailImg, 0, 0, canvas.width, canvas.height);

        // Convert image directly to Base64 Data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "yt-thumbnail-downloader-(imagetoolify.in).jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showToast('<i class="fa-solid fa-check"></i> Downloaded!');
    } catch (err) {
        // Safe Direct Download Link Fallback
        const a = document.createElement("a");
        a.href = currentThumbnailUrl;
        a.download = "yt-thumbnail-downloader-(imagetoolify.in).jpg";
        a.target = "_self";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('<i class="fa-solid fa-check"></i> Download started!');
    }
}

function copyImageUrl() {
    if (!currentThumbnailUrl) { showToast("No image URL"); return; }
    navigator.clipboard.writeText(currentThumbnailUrl);
    showToast('<i class="fa-regular fa-clipboard"></i> Image URL copied!');
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerHTML = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

copyTitleBtn.onclick = () => {
    if (currentVideoData.title) {
        navigator.clipboard.writeText(currentVideoData.title);
        showToast('<i class="fa-solid fa-check"></i> Title copied!');
    } else {
        showToast("No title yet");
    }
};

copyChannelBtn.onclick = () => {
    if (currentVideoData.channel) {
        navigator.clipboard.writeText(currentVideoData.channel);
        showToast('<i class="fa-solid fa-bullhorn"></i> Channel copied!');
    } else {
        showToast("No channel");
    }
};

fetchBtn.onclick = () => loadVideoAndThumbnail();
urlInput.addEventListener("keypress", (e) => { if (e.key === "Enter") loadVideoAndThumbnail(); });
downloadBtn.onclick = downloadThumbnail;
copyUrlBtn.onclick = copyImageUrl;

document.querySelectorAll(".quality-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const qual = btn.getAttribute("data-quality");
        if (qual && currentVideoId) switchQuality(qual);
        else if (!currentVideoId) showToast("Paste a YouTube link first");
    });
});

previewDiv.style.display = "none";
qualitySelector.style.display = "none";
errorDiv.style.display = "none";