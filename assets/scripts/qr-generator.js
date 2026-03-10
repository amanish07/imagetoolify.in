const input = document.getElementById("qrInput");
const qrBox = document.getElementById("qrcode");
const preview = document.getElementById("previewBox");
const downloadBtn = document.getElementById("download");
const logoUpload = document.getElementById("logoUpload");

let logoData = null;
let finalCanvas = null;

input.addEventListener("input", generateQR);

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

const tempCanvas = qrBox.querySelector("canvas");

qrImg = new Image();
qrImg.src = tempCanvas.toDataURL();

}

const base = new Image();
base.src = qrImg.src;

base.onload = function(){

const padding = 18;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = base.width + padding*2;
canvas.height = base.height + padding*2;

ctx.fillStyle="#ffffff";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.drawImage(base,padding,padding);

if(logoData){

const logo = new Image();
logo.src = logoData;

logo.onload = function(){

const size = base.width/4;

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


function finish(canvas){

finalCanvas = canvas;

const dataURL = canvas.toDataURL("image/png");

qrBox.innerHTML = `<img src="${dataURL}" style="max-width:100%">`;

}


downloadBtn.addEventListener("click",function(){

if(!finalCanvas) return;

finalCanvas.toBlob(function(blob){

const url = URL.createObjectURL(blob);

const link = document.createElement("a");

link.href = url;
link.download = "qr-code (imagetoolify.in).png";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

URL.revokeObjectURL(url);

});

});


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
