/* INPUT ELEMENTS */

const input = document.getElementById("qrInput");
const qrBox = document.getElementById("qrcode");
const preview = document.getElementById("previewBox");
const downloadBtn = document.getElementById("download");
const logoUpload = document.getElementById("logoUpload");

let logoData = null;
let finalBlob = null;


/* AUTO GENERATE WHILE TYPING */

input.addEventListener("input", generateQR);


/* LOGO UPLOAD */

logoUpload.onchange = () => {

const file = logoUpload.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = () => {

logoData = reader.result;

generateQR();

};

reader.readAsDataURL(file);

};



/* GENERATE QR */

function generateQR() {

if (!input.value) {

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


setTimeout(() => {

let img = qrBox.querySelector("img");

if (!img) {

const canvasTemp = qrBox.querySelector("canvas");

img = new Image();
img.src = canvasTemp.toDataURL();

}


/* CREATE CANVAS */

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const qrImg = new Image();
qrImg.src = img.src;

qrImg.onload = () => {

const padding = 18;

canvas.width = qrImg.width + padding * 2;
canvas.height = qrImg.height + padding * 2;


/* WHITE BACKGROUND */

ctx.fillStyle = "#ffffff";
ctx.fillRect(0,0,canvas.width,canvas.height);


/* DRAW QR */

ctx.drawImage(qrImg,padding,padding);


/* ADD LOGO IF EXISTS */

if (logoData){

const logo = new Image();
logo.src = logoData;

logo.onload = () => {

const size = qrImg.width/4;

ctx.drawImage(
logo,
(canvas.width-size)/2,
(canvas.height-size)/2,
size,
size
);

finishImage(canvas,img);

};

}else{

finishImage(canvas,img);

}

};

},300);

}



/* FINAL IMAGE PROCESS */

function finishImage(canvas,img){

canvas.toBlob(function(blob){

finalBlob = blob;

const url = URL.createObjectURL(blob);

img.src = url;

});

}



/* DOWNLOAD BUTTON */

downloadBtn.addEventListener("click",function(e){

e.preventDefault();

if(!finalBlob) return;

const link = document.createElement("a");

link.href = URL.createObjectURL(finalBlob);
link.download = "qr-code (imagetoolify.in).png";

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

});



/* HAMBURGER MENU */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click",()=>{

menuBtn.classList.toggle("active");

if(navMenu.style.display==="flex"){
navMenu.style.display="none";
}else{
navMenu.style.display="flex";
}

});
