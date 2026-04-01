let canvas = document.getElementById("qrCanvas");
let ctx = canvas.getContext("2d");
let downloadBtn = document.getElementById("downloadBtn");
let fileName = document.getElementById("fileName");
let logoInput = document.getElementById("logoInput");
let qrText = document.getElementById("qrText");

canvas.width = 500;
canvas.height = 500;

let logoFile = null;

logoInput.addEventListener("change", e => {
    logoFile = e.target.files[0];

    if (logoFile) {
        fileName.style.display = "block";
        fileName.textContent = "Selected: " + logoFile.name;
    }
});

function generateQR() {
    const text = qrText.value.trim();

    if (!text) {
        alert("Enter something first");
        return;
    }

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;

    qrImg.onload = () => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 500, 500);

        ctx.drawImage(qrImg, 50, 50, 400, 400);

        if (logoFile) {
            const reader = new FileReader();
            reader.onload = e => {
                const logo = new Image();
                logo.src = e.target.result;

                logo.onload = () => {
                    const maxSize = 65;

                    let width = logo.width;
                    let height = logo.height;

                    if (width > height) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }

                    const x = (500 - width) / 2;
                    const y = (500 - height) / 2;

                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x - 8, y - 8, width + 16, height + 16);

                    ctx.drawImage(logo, x, y, width, height);
                };
            };
            reader.readAsDataURL(logoFile);
        }
    };

    downloadBtn.style.display = "block";
}

function downloadQR() {
    const link = document.createElement("a");
    link.download = "imagetoolify-qr.png";
    link.href = canvas.toDataURL();
    link.click();
}

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");

    if (navMenu.style.display === "flex") {
        navMenu.style.display = "none";
    } else {
        navMenu.style.display = "flex";
    }
});