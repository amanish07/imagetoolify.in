 // Navbar Mobile Menu Toggle
        const menuBtn = document.getElementById("menuBtn");
        const navMenu = document.getElementById("navMenu");

        menuBtn.addEventListener("click", () => {
            menuBtn.classList.toggle("active");
            navMenu.style.display = (navMenu.style.display === "flex") ? "none" : "flex";
        });

        // IMAGE TO PDF ENGINE
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const editorWrapper = document.getElementById('editorWrapper');
        const previewGrid = document.getElementById('previewGrid');

        const addMoreBtn = document.getElementById('addMoreBtn');
        const resetBtn = document.getElementById('resetBtn');
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');

        let selectedFiles = [];

        // Drag-and-Drop
        ['dragenter', 'dragover'].forEach(name => {
            uploadZone.addEventListener(name, (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach(name => {
            uploadZone.addEventListener(name, (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); });
        });

        uploadZone.addEventListener('drop', (e) => {
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        addMoreBtn.addEventListener('click', () => {
            fileInput.click();
        });

        function handleFiles(files) {
            const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (validFiles.length === 0) return;

            selectedFiles = selectedFiles.concat(validFiles);
            renderPreview();

            uploadZone.style.display = 'none';
            editorWrapper.style.display = 'flex';
        }

        function renderPreview() {
            previewGrid.innerHTML = '';
            
            selectedFiles.forEach((file, index) => {
                const card = document.createElement('div');
                card.className = 'img-card';

                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.onclick = () => removeImage(index);

                card.appendChild(img);
                card.appendChild(removeBtn);
                previewGrid.appendChild(card);
            });
        }

        function removeImage(index) {
            selectedFiles.splice(index, 1);
            if (selectedFiles.length === 0) {
                resetTool();
            } else {
                renderPreview();
            }
        }

        // Convert to PDF Logic
        downloadPdfBtn.addEventListener('click', async () => {
            if (selectedFiles.length === 0) return;

            downloadPdfBtn.innerText = "Generating PDF...";
            downloadPdfBtn.disabled = true;

            const { jsPDF } = window.jspdf;
            const pageSize = document.getElementById('pageSize').value;
            const orientation = document.getElementById('pageOrientation').value;
            const margin = parseInt(document.getElementById('pageMargin').value, 10);
            const customName = document.getElementById('fileNameInput').value.trim();
            const finalFileName = customName ? customName : 'converted-(imagetoolify.in)';

            let pdf = null;

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const imgData = await getBase64(file);
                const imgProps = await getImageDimensions(imgData);

                let pdfWidth, pdfHeight;

                if (pageSize === 'auto') {
                    pdfWidth = imgProps.width;
                    pdfHeight = imgProps.height;
                    if (i === 0) {
                        pdf = new jsPDF({ orientation: imgProps.width > imgProps.height ? 'l' : 'p', unit: 'px', format: [pdfWidth, pdfHeight] });
                    } else {
                        pdf.addPage([pdfWidth, pdfHeight], imgProps.width > imgProps.height ? 'l' : 'p');
                    }
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                } else {
                    if (i === 0) {
                        pdf = new jsPDF({ format: pageSize, orientation: orientation, unit: 'mm' });
                    } else {
                        pdf.addPage(pageSize, orientation);
                    }

                    pdfWidth = pdf.internal.pageSize.getWidth();
                    pdfHeight = pdf.internal.pageSize.getHeight();

                    const availWidth = pdfWidth - (margin * 2);
                    const availHeight = pdfHeight - (margin * 2);

                    const scaleRatio = Math.min(availWidth / imgProps.width, availHeight / imgProps.height);
                    const finalW = imgProps.width * scaleRatio;
                    const finalH = imgProps.height * scaleRatio;

                    const xPos = (pdfWidth - finalW) / 2;
                    const yPos = (pdfHeight - finalH) / 2;

                    pdf.addImage(imgData, 'JPEG', xPos, yPos, finalW, finalH);
                }
            }

            pdf.save(`${finalFileName}.pdf`);
            downloadPdfBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
            downloadPdfBtn.disabled = false;
        });

        function getBase64(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        function getImageDimensions(src) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve({ width: img.width, height: img.height });
                img.src = src;
            });
        }

        // Reset Tool
        resetBtn.addEventListener('click', resetTool);

        function resetTool() {
            selectedFiles = [];
            fileInput.value = '';
            previewGrid.innerHTML = '';
            editorWrapper.style.display = 'none';
            uploadZone.style.display = 'block';
        }

        // Accordion Interactive JS for FAQs
        document.querySelectorAll('.seo-faq-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.parentElement;
                item.classList.toggle('active');
            });
        });