let file, img;
const upload = document.getElementById("upload");
const formatSel = document.getElementById("format");

upload.onchange = () => {
  file = upload.files[0];
  if (!file) return;
  document.getElementById("fileInfo").innerText =
    `${file.name} (${Math.round(file.size / 1024)} KB)`;
};

document.getElementById("convertBtn").onclick = async () => {
  if (!file) {
    alert("Upload image");
    return;
  }

  document.getElementById("processing").style.display = "block";

  img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);

  const selected = formatSel.options[formatSel.selectedIndex];
  const type = selected.value;
  const ext = selected.dataset.ext;

  const blob = await new Promise(r => canvas.toBlob(r, type, 0.95));
  const url = URL.createObjectURL(blob);

  document.getElementById("previewImg").src = url;

  const download = document.getElementById("download");
  download.href = url;
  download.download = "imagetoolify-converted." + ext;

  document.getElementById("processing").style.display = "none";
  document.getElementById("previewBox").style.display = "block";
};



const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");

  if(navMenu.style.display === "flex"){
    navMenu.style.display = "none";
  }else{
    navMenu.style.display = "flex";
  }
});