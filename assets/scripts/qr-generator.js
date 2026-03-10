/* INPUT ELEMENTS */

const input = document.getElementById("qrInput");
const qrBox = document.getElementById("qrcode");
const preview = document.getElementById("previewBox");
const downloadBtn = document.getElementById("download");
const logoUpload = document.getElementById("logoUpload");

let logoData = null;
let finalBlob = null;


/* AUTO GENERATE */

input.addEventListener("input", generateQR);


/* LOGO UPLOAD */

logoUpload.onchange = () => {

const file = logoUpload.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = function(e){

logoData = e.target.result;

generateQR();

};

reader.readAsDataURL(file);

};



/* GENERATE QR */

function generateQR(){

if(!input.value){

qrBox.innerHTML="";
preview.style.display="none";

return;

}

qrBox.innerHTML="";


new QRCode(qrBox,{
text:input.value,
width:250,
height:250
});


preview.style.display="block";


setTimeout(()=>{

let qrImg = qrBox.querySelector("img");

if(!qrImg){

const canvasTemp = qrBox.querySelector("canvas");

qrImg = new Image();
qrImg.src = canvasTemp.toDataURL();

}


const img = new Image();

img.src = qrImg.src;


img.onload = function(){

const padding = 18;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = img.width + padding*2;
canvas.height = img.height + padding*2;


/* white background */

ctx.fillStyle="#ffffff";
ctx.fillRect(0,0,canvas.width,canvas.height);


/* draw qr */

ctx.drawImage(img,padding,padding);


/* add logo if exists */

if(logoData){

const logo = new Image();

logo.src = logoData;

logo.onload = function(){

const size = img.width/4;

ctx.drawImage(
logo,
(canvas.width-size)/2,
(canvas.height-size)/2,
size,
size
);

finish(canvas);

};

}else{

finish(canvas);

}


};

},300);

}



/* FINAL IMAGE */

function finish(canvas){

canvas.toBlob(function(blob){

finalBlob = blob;

const url = URL.createObjectURL(blob);

document.querySelector("#qrcode img").src = url;

});

}



/* DOWNLOAD */

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
