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
        const targetFormat = document.getElementById('targetFormat');
        const customFileNameInput = document.getElementById('customFileName');
        const qualityInput = document.getElementById('qualityInput');
        const qualityVal = document.getElementById('qualityVal');
        const qualityGroup = document.getElementById('qualityGroup');
        const downloadBtn = document.getElementById('downloadBtn');
        const resetBtn = document.getElementById('resetBtn');

        let loadedImage = null;
        let originalFileName = "image";

        // Click to upload
        dropZone.addEventListener('click', () => fileInput.click());

        // Drag & Drop handlers
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

        // Quality slider display update
        qualityInput.addEventListener('input', () => {
            qualityVal.textContent = qualityInput.value;
        });

        // Disable quality slider for non-lossy formats
        targetFormat.addEventListener('change', () => {
            const fmt = targetFormat.value;
            if (fmt === 'image/png' || fmt === 'image/bmp' || fmt === 'image/gif' || fmt === 'image/svg+xml' || fmt === 'image/x-icon' || fmt === 'image/tiff' || fmt === 'image/tif') {
                qualityGroup.style.opacity = '0.5';
                qualityInput.disabled = true;
            } else {
                qualityGroup.style.opacity = '1';
                qualityInput.disabled = false;
            }
        });

        // File Handler
        function handleFile(file) {
            // Extract file name without extension
            originalFileName = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted-image';
            customFileNameInput.value = originalFileName;

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    loadedImage = img;
                    imagePreview.src = e.target.result;
                    previewBox.style.display = 'flex';
                    fileInfo.innerHTML = `<strong>${file.name}</strong> (${img.width} x ${img.height}px) - ${(file.size / 1024).toFixed(1)} KB`;
                    downloadBtn.disabled = false;
                };
                img.onerror = function () {
                    alert("Selected format is preview-restricted by browser, but conversion will process.");
                    downloadBtn.disabled = false;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        // Extension Resolver Map
        function getExtensionFromMime(mime) {
            switch (mime) {
                case 'image/png': return 'png';
                case 'image/webp': return 'webp';
                case 'image/gif': return 'gif';
                case 'image/bmp': return 'bmp';
                case 'image/x-icon': return 'ico';
                case 'image/svg+xml': return 'svg';
                case 'image/avif': return 'avif';
                case 'image/heic': return 'heic';
                case 'image/heif': return 'heif';
                case 'image/tiff': return 'tiff';
                case 'image/tif': return 'tif';
                case 'image/jxl': return 'jxl';
                case 'image/jpeg':
                default: return 'jpg';
            }
        }

        // Conversion & Download Engine
        downloadBtn.addEventListener('click', () => {
            if (!loadedImage) return;

            const canvas = document.createElement('canvas');
            canvas.width = loadedImage.width;
            canvas.height = loadedImage.height;
            const ctx = canvas.getContext('2d');

            const mimeType = targetFormat.value;
            const quality = parseFloat(qualityInput.value) / 100;

            // Fill white background for non-alpha formats
            if (mimeType === 'image/jpeg' || mimeType === 'image/bmp') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw image on canvas
            ctx.drawImage(loadedImage, 0, 0);

            // Resolve Extension & File Name
            const ext = getExtensionFromMime(mimeType);
            const userEnteredName = customFileNameInput.value.trim();
            const finalFileName = userEnteredName !== "" ? userEnteredName : originalFileName;

            // Convert canvas to Data URL and download
            let dataUrl;
            try {
                dataUrl = canvas.toDataURL(mimeType, quality);
            } catch (err) {
                // Fallback to PNG if browser lacks native encoder for niche format
                dataUrl = canvas.toDataURL('image/png');
            }

            const link = document.createElement('a');
            link.download = `${finalFileName}.${ext}`;
            link.href = dataUrl;
            link.click();
        });

        // Reset Logic
        resetBtn.addEventListener('click', () => {
            loadedImage = null;
            fileInput.value = '';
            imagePreview.src = '';
            previewBox.style.display = 'none';
            downloadBtn.disabled = true;
            qualityInput.value = 90;
            qualityVal.textContent = '90';
            targetFormat.value = 'image/jpeg';
            customFileNameInput.value = '';
            qualityGroup.style.opacity = '1';
            qualityInput.disabled = false;
        });