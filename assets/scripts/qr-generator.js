/* ===============================
GET ELEMENTS
=============================== */

const input = document.getElementById("qrInput");
const qrBox = document.getElementById("qrcode");
const preview = document.getElementById("previewBox");
const downloadBtn = document.getElementById("download");
const logoUpload = document.getElementById("logoUpload");

let logoData = null;
let finalImage = null;


/* ===============================
AUTO GENERATE WHILE TYPING
=============================== */

input.addEventListener("input", generateQR);


/* ===============================
LOGO UPLOAD
=============================== */

logoUpload.addEventListener("change", function(){

const file = this.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(e){

logoData = e.target.result;

generateQR();

};

reader.readAsDataURL(file);

});



/* ===============================
GENERATE QR
=============================== */

function generateQR(){

if(!input.value){

qrBox.innerHTML = "";
preview.style.display = "none";
return;

}

qrBox.innerHTML = "";


/* CREATE QR */

new QRCode(qrBox,{
text: input.value,
width: 250,
height: 250
});


preview.style.display = "block";


setTimeout(function(){

let qrImg = qrBox.querySelector("img");

/* if library creates canvas */

if(!qrImg){

const tempCanvas = qrBox.querySelector("canvas");

qrImg = new Image();
qrImg.src = tempCanvas.toDataURL();

}


const baseImage = new Image();

baseImage.src = qrImg.src;


baseImage.onload = function(){

const padding = 18;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = baseImage.width + padding*2;
canvas.height = baseImage.height + padding*2;


/* WHITE BACKGROUND */

ctx.fillStyle = "#ffffff";
ctx.fillRect(0,0,canvas.width,canvas.height);


/* DRAW QR */

ctx.drawImage(baseImage,padding,padding);


/* ADD LOGO */

if(logoData){

const logo = new Image();

logo.src = logoData;

logo.onload = function(){

const size = baseImage.width/4;

ctx.drawImage(
logo,
(canvas.width-size)/2,
(canvas.height-size)/2,
size,
size
);

finishImage(canvas);

};

}else{

finishImage(canvas);

}

};

},300);

}



/* ===============================
FINAL IMAGE PROCESS
=============================== */

function finishImage(canvas){

finalImage = canvas.toDataURL("image/png");

/* show preview */

const previewImg = qrBox.querySelector("img");

if(previewImg){

previewImg.src = finalImage;

}else{

qrBox.innerHTML = `<img src="${finalImage}" alt="QR Code">`;

}

}



/* ===============================
DOWNLOAD BUTTON
=============================== */

downloadBtn.addEventListener("click",function(e){

e.preventDefault();

if(!finalImage) return;

const link = document.createElement("a");

link.href = finalImage;
link.download = "qr-code-imagetoolify.png";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

});



/* ===============================
HAMBURGER MENU
=============================== */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click",function(){

menuBtn.classList.toggle("active");

if(navMenu.style.display === "flex"){

navMenu.style.display = "none";

}else{

navMenu.style.display = "flex";

}

});
