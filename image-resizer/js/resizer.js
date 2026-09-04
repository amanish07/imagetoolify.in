// Navbar Toggle

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.style.display = (navMenu.style.display === "flex") ? "none" : "flex";
});

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewBox = document.getElementById('previewBox');
const imagePreview = document.getElementById('imagePreview');
const fileInfo = document.getElementById('fileInfo');
const presetSelect = document.getElementById('presetSelect');
const targetWidthInput = document.getElementById('targetWidth');
const targetHeightInput = document.getElementById('targetHeight');
const targetKBInput = document.getElementById('targetKB');
const outputFormatSelect = document.getElementById('outputFormat');
const customFileNameInput = document.getElementById('customFileName');

const outputPreviewBox = document.getElementById('outputPreviewBox');
const outputImagePreview = document.getElementById('outputImagePreview');
const outputInfo = document.getElementById('outputInfo');

const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// Cropper Toolbar Buttons
const btnRotateLeft = document.getElementById('btnRotateLeft');
const btnRotateRight = document.getElementById('btnRotateRight');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnFreeCrop = document.getElementById('btnFreeCrop');

let cropper = null;
let originalFileName = "govt_photo";
let rawFile = null;
let originalWidth = 0;
let originalHeight = 0;

// PRESETS CONFIG
const presets = {
    // PAN Card Presets
    pan_photo: { w: 295, h: 413, kb: 30, ratio: 295 / 413, format: 'jpg', name: 'pan_card_photo' },
    pan_sig: { w: 300, h: 150, kb: 10, ratio: 300 / 150, format: 'jpg', name: 'pan_card_signature' },
    pan_doc: { w: '', h: '', kb: 300, ratio: NaN, format: 'pdf', name: 'pan_card_document' },

    // Voter Card Presets
    voter_photo: { w: 350, h: 450, kb: 50, ratio: 350 / 450, format: 'jpg', name: 'voter_card_photo' },
    voter_sig: { w: 300, h: 120, kb: 20, ratio: 300 / 120, format: 'jpg', name: 'voter_card_signature' },
    voter_doc: { w: '', h: '', kb: 200, ratio: NaN, format: 'pdf', name: 'voter_card_document' },

    // Passport & Standard Presets
    passport_india: { w: 413, h: 531, kb: 200, ratio: 413 / 531, format: 'jpg', name: 'passport_photo' },
    govt_signature_std: { w: 300, h: 120, kb: 20, ratio: 2.5 / 1, format: 'jpg', name: 'standard_signature' }
};

// Preset selection handler
presetSelect.addEventListener('change', () => {
    const selected = presetSelect.value;
    if (selected !== 'custom' && presets[selected]) {
        const p = presets[selected];
        targetWidthInput.value = p.w;
        targetHeightInput.value = p.h;
        targetKBInput.value = p.kb;
        outputFormatSelect.value = p.format;
        customFileNameInput.value = p.name;
        if (cropper) {
            cropper.setAspectRatio(p.ratio);
        }
    } else if (selected === 'custom') {
        if (cropper) {
            cropper.setAspectRatio(NaN); // Free ratio
        }
        targetWidthInput.value = '';
        targetHeightInput.value = '';
        targetKBInput.value = '';
        customFileNameInput.value = '';
    }
});

// File drop & select listeners
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(33, 150, 243, 0.1)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.background = 'rgba(0, 0, 0, 0.02)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(0, 0, 0, 0.02)';
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// File Handler & Cropper Initialization
function handleFile(file) {
    rawFile = file;
    originalFileName = file.name.substring(0, file.name.lastIndexOf('.')) || 'photo_signature';

    const reader = new FileReader();
    reader.onload = function (e) {
        imagePreview.src = e.target.result;
        previewBox.style.display = 'flex';
        outputPreviewBox.style.display = 'none';

        if (cropper) {
            cropper.destroy();
        }

        const initialRatio = (presetSelect.value !== 'custom' && presets[presetSelect.value])
            ? presets[presetSelect.value].ratio
            : NaN;

        cropper = new Cropper(imagePreview, {
            aspectRatio: initialRatio,
            viewMode: 1,
            autoCropArea: 0.9,
            responsive: true,
            background: false,
            ready() {
                const imgData = cropper.getImageData();
                originalWidth = imgData.naturalWidth;
                originalHeight = imgData.naturalHeight;
                const originalKB = (file.size / 1024).toFixed(1);

                fileInfo.innerHTML = `<strong>Original:</strong> ${file.name} (${originalWidth} × ${originalHeight}px) - ${originalKB} KB`;
                previewBtn.disabled = false;
                downloadBtn.disabled = false;

                if (presetSelect.value === 'custom') {
                    targetWidthInput.value = '';
                    targetHeightInput.value = '';
                    targetKBInput.value = '';
                    customFileNameInput.value = '';
                } else {
                    const currentPreset = presets[presetSelect.value];
                    if (currentPreset) {
                        customFileNameInput.value = currentPreset.name;
                        outputFormatSelect.value = currentPreset.format;
                        targetWidthInput.value = currentPreset.w;
                        targetHeightInput.value = currentPreset.h;
                        targetKBInput.value = currentPreset.kb;
                    }
                }
            }
        });
    };
    reader.readAsDataURL(file);
}

// Cropper Controls
btnRotateLeft.addEventListener('click', () => cropper && cropper.rotate(-90));
btnRotateRight.addEventListener('click', () => cropper && cropper.rotate(90));
btnZoomIn.addEventListener('click', () => cropper && cropper.zoom(0.1));
btnZoomOut.addEventListener('click', () => cropper && cropper.zoom(-0.1));
btnFreeCrop.addEventListener('click', () => {
    if (cropper) {
        cropper.setAspectRatio(NaN);
        presetSelect.value = 'custom';
        targetWidthInput.value = '';
        targetHeightInput.value = '';
        targetKBInput.value = '';
        customFileNameInput.value = '';
    }
});

// Image Cropping, Resizing & Compression Engine
function processImage() {
    if (!cropper) return null;

    const croppedCanvas = cropper.getCroppedCanvas({
        fillColor: '#FFFFFF',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    if (!croppedCanvas) return null;

    const targetW = parseInt(targetWidthInput.value) || croppedCanvas.width;
    const targetH = parseInt(targetHeightInput.value) || croppedCanvas.height;
    const maxKB = parseFloat(targetKBInput.value) || Math.ceil((rawFile ? rawFile.size : 1024) / 1024);
    const maxBytes = maxKB * 1024;
    const format = outputFormatSelect.value;

    // Resize Canvas to Target Dimensions
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = targetW;
    resizedCanvas.height = targetH;
    const ctx = resizedCanvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(croppedCanvas, 0, 0, targetW, targetH);

    const mimeType = 'image/jpeg';

    let minQuality = 0.01;
    let maxQuality = 1.0;
    let optimalQuality = 0.9;
    let resultDataUrl = '';
    let currentSize = 0;

    for (let i = 0; i < 12; i++) {
        optimalQuality = (minQuality + maxQuality) / 2;
        resultDataUrl = resizedCanvas.toDataURL(mimeType, optimalQuality);

        const head = `data:${mimeType};base64,`;
        currentSize = Math.round((resultDataUrl.length - head.length) * 3 / 4);

        if (currentSize > maxBytes) {
            maxQuality = optimalQuality;
        } else {
            minQuality = optimalQuality;
        }
    }

    if (currentSize > maxBytes) {
        resultDataUrl = resizedCanvas.toDataURL(mimeType, minQuality);
        const head = `data:${mimeType};base64,`;
        currentSize = Math.round((resultDataUrl.length - head.length) * 3 / 4);
    }

    return {
        dataUrl: resultDataUrl,
        width: targetW,
        height: targetH,
        sizeKB: (currentSize / 1024).toFixed(1),
        format: format
    };
}

// Generate Preview Handler
previewBtn.addEventListener('click', () => {
    const processed = processImage();
    if (!processed) return;

    outputImagePreview.src = processed.dataUrl;
    outputInfo.innerHTML = `Resized: ${processed.width} × ${processed.height}px | Format: <strong>${processed.format.toUpperCase()}</strong> | Final Size: <span style="color:#10b981;">${processed.sizeKB} KB</span>`;
    outputPreviewBox.style.display = 'flex';
    outputPreviewBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Download Handler
downloadBtn.addEventListener('click', () => {
    const processed = processImage();
    if (!processed) return;

    const userEnteredName = customFileNameInput.value.trim();
    const finalName = userEnteredName !== "" ? userEnteredName : originalFileName;
    const ext = processed.format;

    if (processed.format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: processed.width > processed.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [processed.width, processed.height]
        });
        pdf.addImage(processed.dataUrl, 'JPEG', 0, 0, processed.width, processed.height);
        pdf.save(`${finalName}.pdf`);
    } else {
        const link = document.createElement('a');
        link.download = `${finalName}.${ext}`;
        link.href = processed.dataUrl;
        link.click();
    }
});

// Reset Handler
resetBtn.addEventListener('click', () => {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    rawFile = { rawFile: null };
    originalWidth = 0;
    originalHeight = 0;
    fileInput.value = '';
    imagePreview.src = '';
    outputImagePreview.src = '';
    previewBox.style.display = 'none';
    outputPreviewBox.style.display = 'none';
    previewBtn.disabled = true;
    downloadBtn.disabled = true;
    presetSelect.value = 'custom';
    outputFormatSelect.value = 'jpg';
    targetWidthInput.value = '';
    targetHeightInput.value = '';
    targetKBInput.value = '';
    customFileNameInput.value = '';
});