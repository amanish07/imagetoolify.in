        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // Navbar Mobile Menu Toggle
        const menuBtn = document.getElementById("menuBtn");
        const navMenu = document.getElementById("navMenu");

        menuBtn.addEventListener("click", () => {
            menuBtn.classList.toggle("active");
            navMenu.style.display = (navMenu.style.display === "flex") ? "none" : "flex";
        });

        // PDF TO IMAGE ENGINE
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const loadingBox = document.getElementById('loadingBox');
        const loadingProgressText = document.getElementById('loadingProgressText');
        const editorWrapper = document.getElementById('editorWrapper');
        const previewGrid = document.getElementById('previewGrid');
        const resetBtn = document.getElementById('resetBtn');
        const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        const selectedCountText = document.getElementById('selectedCountText');

        let pdfDoc = null;
        let selectedPages = new Set();

        // Drag & Drop
        ['dragenter', 'dragover'].forEach(name => {
            uploadZone.addEventListener(name, (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach(name => {
            uploadZone.addEventListener(name, (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); });
        });

        uploadZone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length > 0) handlePdf(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handlePdf(e.target.files[0]);
        });

        async function handlePdf(file) {
            if (file.type !== 'application/pdf') {
                alert("Please select a valid PDF file.");
                return;
            }

            // Hide Upload Zone & Show Loading Indicator
            uploadZone.style.display = 'none';
            loadingBox.style.display = 'flex';
            loadingProgressText.innerText = "Reading PDF file...";

            try {
                const arrayBuffer = await file.arrayBuffer();

                // Loading PDF with Password Handling Callback
                const loadingTask = pdfjsLib.getDocument({
                    data: arrayBuffer
                });

                loadingTask.onPassword = function (updatePassword, reason) {
                    let userPass = prompt(
                        reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD
                            ? "Incorrect Password! Please enter the correct password to open this PDF:"
                            : "This PDF is password-protected. Please enter the password:"
                    );

                    if (userPass !== null && userPass.trim() !== "") {
                        updatePassword(userPass.trim());
                    } else {
                        // User cancelled password prompt
                        alert("Password is required to open this PDF.");
                        resetTool();
                    }
                };

                pdfDoc = await loadingTask.promise;

                selectedPages.clear();
                selectAllCheckbox.checked = false;

                await renderPreviews();
                updateSelectionUI();

                // Hide Loading & Show Editor Dashboard
                loadingBox.style.display = 'none';
                editorWrapper.style.display = 'flex';
            } catch (err) {
                if (err.name !== 'PasswordException') {
                    alert("Failed to load PDF file or process password.");
                }
                resetTool();
            }
        }

        async function renderPreviews() {
            previewGrid.innerHTML = '';
            const totalPages = pdfDoc.numPages;

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                loadingProgressText.innerText = `Loading page ${pageNum} of ${totalPages}...`;

                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 0.3 });

                const card = document.createElement('div');
                card.className = 'img-card';
                card.dataset.pageNum = pageNum;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'page-checkbox';
                checkbox.checked = false;
                checkbox.onclick = (e) => e.stopPropagation();

                checkbox.addEventListener('change', () => {
                    togglePageSelection(pageNum, checkbox.checked, card);
                });

                card.addEventListener('click', () => {
                    checkbox.checked = !checkbox.checked;
                    togglePageSelection(pageNum, checkbox.checked, card);
                });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                const badge = document.createElement('span');
                badge.className = 'page-badge';
                badge.innerText = `Page ${pageNum}`;

                card.appendChild(checkbox);
                card.appendChild(canvas);
                card.appendChild(badge);
                previewGrid.appendChild(card);
            }
        }

        function togglePageSelection(pageNum, isChecked, cardElement) {
            if (isChecked) {
                selectedPages.add(pageNum);
                cardElement.classList.add('selected');
            } else {
                selectedPages.delete(pageNum);
                cardElement.classList.remove('selected');
            }
            updateSelectionUI();
        }

        function updateSelectionUI() {
            const total = pdfDoc ? pdfDoc.numPages : 0;
            const selected = selectedPages.size;

            selectedCountText.innerText = `${selected} of ${total} selected`;
            selectAllCheckbox.checked = (selected === total && total > 0);

            if (selected === 0) {
                downloadSelectedBtn.innerText = "Download Selected (0)";
                downloadSelectedBtn.disabled = true;
            } else {
                downloadSelectedBtn.innerText = `Download Selected (${selected})`;
                downloadSelectedBtn.disabled = false;
            }
        }

        // Select All / Deselect All Handler
        selectAllCheckbox.addEventListener('change', () => {
            const isChecked = selectAllCheckbox.checked;
            const cards = previewGrid.querySelectorAll('.img-card');

            selectedPages.clear();
            cards.forEach(card => {
                const pageNum = parseInt(card.dataset.pageNum);
                const checkbox = card.querySelector('.page-checkbox');
                checkbox.checked = isChecked;

                if (isChecked) {
                    selectedPages.add(pageNum);
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });

            updateSelectionUI();
        });

        // Download Helper Function
        async function processDownload(pagesList) {
            const format = document.getElementById('imageFormat').value;
            const scale = parseFloat(document.getElementById('imageScale').value);
            const customNameInput = document.getElementById('fileNameInput').value.trim();
            const baseName = customNameInput ? customNameInput : '(imagetoolify.in)';
            const ext = format === 'image/png' ? 'png' : 'jpg';

            for (let pageNum of pagesList) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                const imageUrl = canvas.toDataURL(format, 0.92);
                const a = document.createElement('a');
                a.href = imageUrl;

                a.download = `${baseName}-${pageNum}.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        // Download Selected Action
        downloadSelectedBtn.addEventListener('click', async () => {
            if (!pdfDoc || selectedPages.size === 0) return;

            downloadSelectedBtn.innerText = "Processing...";
            downloadSelectedBtn.disabled = true;

            const pagesToDownload = Array.from(selectedPages).sort((a, b) => a - b);
            await processDownload(pagesToDownload);

            updateSelectionUI();
        });

        // Download All Action
        downloadAllBtn.addEventListener('click', async () => {
            if (!pdfDoc) return;

            downloadAllBtn.innerText = "Processing...";
            downloadAllBtn.disabled = true;

            const allPages = [];
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                allPages.push(i);
            }

            await processDownload(allPages);

            downloadAllBtn.innerHTML = '<i class="fas fa-download"></i> Download All';
            downloadAllBtn.disabled = false;
        });

        // Reset Tool Helper
        function resetTool() {
            pdfDoc = null;
            selectedPages.clear();
            fileInput.value = '';
            previewGrid.innerHTML = '';
            editorWrapper.style.display = 'none';
            loadingBox.style.display = 'none';
            uploadZone.style.display = 'block';
        }

        resetBtn.addEventListener('click', resetTool);

        // FAQ Accordion
        document.querySelectorAll('.seo-faq-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.parentElement.classList.toggle('active');
            });
        });