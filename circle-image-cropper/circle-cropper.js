// Navbar Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.style.display = (navMenu.style.display === "flex") ? "none" : "flex";
});

// CROPPER ENGINE
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const editorWrapper = document.getElementById('editorWrapper');
const container = document.getElementById('canvasContainer');
const canvas = document.getElementById('cropperCanvas');
const ctx = canvas.getContext('2d');

const zoomSlider = document.getElementById('zoomSlider');
const zoomVal = document.getElementById('zoomVal');
const rotateLeftBtn = document.getElementById('rotateLeftBtn');
const rotateRightBtn = document.getElementById('rotateRightBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let loadedImg = new Image();
let state = {
    x: 0,
    y: 0,
    scale: 1,
    minScale: 0.1,
    rotation: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0
};

// Drag-and-Drop File Upload
['dragenter', 'dragover'].forEach(name => {
    uploadZone.addEventListener(name, (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
});
['dragleave', 'drop'].forEach(name => {
    uploadZone.addEventListener(name, (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); });
});

uploadZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) loadFile(files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) loadFile(e.target.files[0]);
});

function loadFile(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        loadedImg = new Image();
        loadedImg.onload = initCropper;
        loadedImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function initCropper() {
    // Set canvas render dimension
    const containerW = container.clientWidth || 350;
    const containerH = container.clientHeight || 350;
    canvas.width = containerW;
    canvas.height = containerH;

    const circleDiameter = Math.min(containerW, containerH) * 0.75;

    // Calculate initial minimum scale to fill circle
    const scaleX = circleDiameter / loadedImg.width;
    const scaleY = circleDiameter / loadedImg.height;
    state.minScale = Math.max(scaleX, scaleY);
    state.scale = state.minScale;
    state.rotation = 0;

    // Center image
    state.x = containerW / 2;
    state.y = containerH / 2;

    // Update Slider
    zoomSlider.min = state.minScale;
    zoomSlider.max = state.minScale * 4;
    zoomSlider.value = state.scale;
    zoomVal.textContent = state.scale.toFixed(2) + 'x';

    uploadZone.style.display = 'none';
    editorWrapper.style.display = 'flex';

    draw();
}

// Main Draw Function
function draw() {
    const w = canvas.width;
    const h = canvas.height;
    const radius = Math.min(w, h) * 0.375;

    ctx.clearRect(0, 0, w, h);

    // Save Context for Image Transform
    ctx.save();
    ctx.translate(state.x, state.y);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.scale, state.scale);
    ctx.drawImage(loadedImg, -loadedImg.width / 2, -loadedImg.height / 2);
    ctx.restore();

    // Draw Dark Mask Overlay around Circle
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw Circle Boundary Ring
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.restore();
}

// Drag / Pan Events
container.addEventListener('pointerdown', (e) => {
    state.isDragging = true;
    state.dragStartX = e.clientX - state.x;
    state.dragStartY = e.clientY - state.y;
    container.setPointerCapture(e.pointerId);
});

container.addEventListener('pointermove', (e) => {
    if (!state.isDragging) return;
    state.x = e.clientX - state.dragStartX;
    state.y = e.clientY - state.dragStartY;
    draw();
});

container.addEventListener('pointerup', (e) => {
    state.isDragging = false;
    container.releasePointerCapture(e.pointerId);
});

// Zoom Slider Event
zoomSlider.addEventListener('input', (e) => {
    state.scale = parseFloat(e.target.value);
    zoomVal.textContent = state.scale.toFixed(2) + 'x';
    draw();
});

// Rotation Controls
rotateLeftBtn.addEventListener('click', () => {
    state.rotation = (state.rotation - 90) % 360;
    draw();
});

rotateRightBtn.addEventListener('click', () => {
    state.rotation = (state.rotation + 90) % 360;
    draw();
});

// Export Handler
downloadBtn.addEventListener('click', () => {
    const exportSize = 600; // Crisp output size
    const outCanvas = document.createElement('canvas');
    const outCtx = outCanvas.getContext('2d');

    outCanvas.width = exportSize;
    outCanvas.height = exportSize;

    const selectedFormat = document.getElementById('formatSelect').value.toLowerCase();
    const customName = document.getElementById('fileNameInput').value.trim();
    const finalFileName = customName ? customName : 'croped-(imagetoolify.in)';

    // Solid white background for opaque formats
    if (['jpg', 'jpeg', 'bmp'].includes(selectedFormat)) {
        outCtx.fillStyle = '#ffffff';
        outCtx.fillRect(0, 0, exportSize, exportSize);
    }

    // Circular Clipping Path
    outCtx.beginPath();
    outCtx.arc(exportSize / 2, exportSize / 2, exportSize / 2, 0, Math.PI * 2);
    outCtx.closePath();
    outCtx.clip();

    // Transform and Draw Image onto Output Canvas
    outCtx.save();
    const scaleRatio = exportSize / (Math.min(canvas.width, canvas.height) * 0.75);
    const offsetX = (state.x - canvas.width / 2) * scaleRatio + exportSize / 2;
    const offsetY = (state.y - canvas.height / 2) * scaleRatio + exportSize / 2;

    outCtx.translate(offsetX, offsetY);
    outCtx.rotate((state.rotation * Math.PI) / 180);
    outCtx.scale(state.scale * scaleRatio, state.scale * scaleRatio);
    outCtx.drawImage(loadedImg, -loadedImg.width / 2, -loadedImg.height / 2);
    outCtx.restore();

    // Format resolution logic
    let dataUrl;
    let fileExtension = selectedFormat;

    if (selectedFormat === 'svg') {
        const pngData = outCanvas.toDataURL('image/png');
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${exportSize}" height="${exportSize}"><image href="${pngData}" width="${exportSize}" height="${exportSize}"/></svg>`;
        dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    } else if (['jpg', 'jpeg'].includes(selectedFormat)) {
        dataUrl = outCanvas.toDataURL('image/jpeg', 0.92);
        fileExtension = 'jpg';
    } else if (selectedFormat === 'webp') {
        dataUrl = outCanvas.toDataURL('image/webp', 0.92);
    } else {
        dataUrl = outCanvas.toDataURL('image/png');
    }

    // Download Trigger
    const link = document.createElement('a');
    link.download = `${finalFileName}.${fileExtension}`;
    link.href = dataUrl;
    link.click();
});

// Reset Tool
resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    editorWrapper.style.display = 'none';
    uploadZone.style.display = 'block';
});