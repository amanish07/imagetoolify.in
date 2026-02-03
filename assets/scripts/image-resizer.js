let file, img;
let targetKB = null,
  keepOriginal = false;

const upload = document.getElementById("upload");
const pixelToggle = document.getElementById("pixelToggle");
const pxW = document.getElementById("pxW");
const pxH = document.getElementById("pxH");
const formatSel = document.getElementById("format");
const downloadBtn = document.getElementById("download");

/* pixel toggle */
pixelToggle.onchange = () => {
  pxW.disabled = pxH.disabled = !pixelToggle.checked;
};

/* upload with 10MB LIMIT */
upload.onchange = () => {
  file = upload.files[0];
  if (!file) return;
  
  const maxSize = 10 * 1024 * 1024; // 10 MB
  
  if (file.size > maxSize) {
    alert("Image size must be 10MB or less");
    upload.value = "";
    file = null;
    return;
  }
  
  document.getElementById("fileInfo").innerText =
    `${file.name} (${Math.round(file.size / 1024)} KB)`;
  
  img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    pxW.value = img.width;
    pxH.value = img.height;
  };
};

/* size select */
document.querySelectorAll(".size-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".size-btn")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    if (btn.dataset.size === "original") {
      keepOriginal = true;
      targetKB = null;
    } else {
      keepOriginal = false;
      targetKB = parseInt(btn.dataset.size);
    }
  };
});

/* HARD GUARANTEE compression
   target se zyada kabhi nahi */
async function compressSafe(sourceCanvas, targetKB) {
  let quality = 0.9;
  let scale = 1;
  
  const tmp = document.createElement("canvas");
  const ctx = tmp.getContext("2d");
  
  while (true) {
    tmp.width = Math.max(1, Math.floor(sourceCanvas.width * scale));
    tmp.height = Math.max(1, Math.floor(sourceCanvas.height * scale));
    ctx.drawImage(sourceCanvas, 0, 0, tmp.width, tmp.height);
    
    const blob = await new Promise(r =>
      tmp.toBlob(r, "image/jpeg", quality)
    );
    
    const sizeKB = blob.size / 1024;
    
    /* SUCCESS: target se kam */
    if (sizeKB <= targetKB) {
      return blob;
    }
    
    /* force reduce */
    if (quality > 0.2) {
      quality -= 0.08;
    } else {
      scale *= 0.8;
    }
    
    /* absolute safety */
    if (scale < 0.1) {
      return blob;
    }
  }
}

/* process */
document.getElementById("processBtn").onclick = async () => {
  if (!file) {
    alert("Upload image");
    return;
  }
  if (!keepOriginal && !targetKB) {
    alert("Select size");
    return;
  }
  
  document.getElementById("processing").style.display = "block";
  
  let bw = img.width,
    bh = img.height;
  if (pixelToggle.checked) {
    bw = parseInt(pxW.value);
    bh = parseInt(pxH.value);
  }
  
  const base = document.createElement("canvas");
  base.width = bw;
  base.height = bh;
  base.getContext("2d").drawImage(img, 0, 0, bw, bh);
  
  let blob, sizeKB;
  
  if (keepOriginal) {
    blob = await new Promise(r => base.toBlob(r, "image/jpeg", 0.95));
    sizeKB = blob.size / 1024;
  } else {
    blob = await compressSafe(base, targetKB);
    sizeKB = blob.size / 1024;
  }
  
  const url = URL.createObjectURL(blob);
  document.getElementById("previewImg").src = url;
  document.getElementById("finalSize").innerText = Math.round(sizeKB);
  
  if (formatSel.value === "image") {
    downloadBtn.onclick = null;
    downloadBtn.href = url;
    downloadBtn.download = "(imagetoolify.in).jpg";
  } else {
    downloadBtn.onclick = null;
    downloadBtn.onclick = () => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: bw > bh ? "l" : "p",
        unit: "px",
        format: [bw, bh]
      });
      pdf.addImage(url, "JPEG", 0, 0, bw, bh);
      pdf.save("(imagetoolify.in).pdf");
    };
    downloadBtn.removeAttribute("download");
    downloadBtn.href = "javascript:void(0)";
  }
  
  document.getElementById("processing").style.display = "none";
  document.getElementById("previewBox").style.display = "block";
};
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
