let cropper = null;

/* INIT */
function initCropper(src){

const cropWrapper = document.getElementById("cropWrapper");
const cropImage = document.getElementById("cropImage");

if(!cropWrapper || !cropImage) return;

cropWrapper.style.display = "block";
cropImage.src = src;

if(cropper){
cropper.destroy();
cropper = null;
}

cropper = new Cropper(cropImage,{
viewMode:1,
autoCropArea:1,
responsive:true,
background:false
});

}

/* GET CANVAS */
function getCroppedCanvas(){
if(!cropper) return null;

return cropper.getCroppedCanvas({
imageSmoothingQuality:"high"
});
}

/* RATIOS */

function cropFree(){
if(!cropper) return;
cropper.setAspectRatio(NaN);
}

function cropSquare(){
if(!cropper) return;
cropper.setAspectRatio(1);
}

function cropPan(){
if(!cropper) return;
cropper.setAspectRatio(1);
}

function cropPassport(){
if(!cropper) return;
cropper.setAspectRatio(35/45);
}

function cropSignature(){
if(!cropper) return;
cropper.setAspectRatio(3/1);
}