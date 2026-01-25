

let file, img;
let targetKB = null,
  keepOriginal = false;

const upload = document.getElementById("upload");
const pixelToggle = document.getElementById("pixelToggle");
const pxW = document.getElementById("pxW");
const pxH = document.getElementById("pxH");
const formatSel = document.getElementById("format");
const downloadBtn = document.getElementById("download");

pixelToggle.onchange = () => {
  pxW.disabled = pxH.disabled = !pixelToggle.checked;
};

upload.onchange = () => {
  file = upload.files[0];
  if (!file) return;
  document.getElementById("fileInfo").innerText =
    `${file.name} (${Math.round(file.size/1024)} KB)`;
  img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    pxW.value = img.width;
    pxH.value = img.height;
  };
};

document.querySelectorAll(".size-btn").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".size-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    if (b.dataset.size === "original") {
      keepOriginal = true;
      targetKB = null;
    } else {
      keepOriginal = false;
      targetKB = parseInt(b.dataset.size);
    }
  };
});

async function compressSafe(sourceCanvas, targetKB) {
  let quality = 0.9,
    scale = 1,
    blob, size;
  const tmp = document.createElement("canvas");
  const ctx = tmp.getContext("2d");
  
  while (true) {
    tmp.width = sourceCanvas.width * scale;
    tmp.height = sourceCanvas.height * scale;
    ctx.drawImage(sourceCanvas, 0, 0, tmp.width, tmp.height);
    
    blob = await new Promise(r => tmp.toBlob(r, "image/jpeg", quality));
    size = blob.size / 1024;
    
    if (size <= targetKB && size >= targetKB - 5) return blob;
    if (size > targetKB) {
      if (quality > 0.4) quality -= 0.05;
      else scale -= 0.05;
    } else return blob;
    if (scale < 0.3) return blob;
  }
}

document.getElementById("processBtn").onclick = async () => {
  if (!file) { alert("Upload image"); return; }
  if (!keepOriginal && !targetKB) { alert("Select size"); return; }
  
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
  
  let blob, size;
  if (keepOriginal) {
    blob = await new Promise(r => base.toBlob(r, "image/jpeg", 0.95));
    size = blob.size / 1024;
  } else {
    blob = await compressSafe(base, targetKB);
    size = blob.size / 1024;
  }
  
  const url = URL.createObjectURL(blob);
  document.getElementById("previewImg").src = url;
  document.getElementById("finalSize").innerText = Math.round(size);
  
  if (formatSel.value === "image") {
    downloadBtn.onclick = null;
    downloadBtn.href = url;
    downloadBtn.download = "image.jpg";
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
      pdf.save("image.pdf");
    };
    downloadBtn.removeAttribute("download");
    downloadBtn.href = "javascript:void(0)";
  }
  
  document.getElementById("processing").style.display = "none";
  document.getElementById("previewBox").style.display = "block";
};