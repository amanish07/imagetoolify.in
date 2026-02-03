const tabs=document.querySelectorAll(".tab");
const panels=document.querySelectorAll(".panel");
const preview=document.getElementById("preview");
const processing=document.getElementById("processing");

/* TAB SWITCH */
tabs.forEach(t=>{
  t.onclick=()=>{
    tabs.forEach(x=>x.classList.remove("active"));
    panels.forEach(p=>p.classList.remove("active"));
    t.classList.add("active");
    document.getElementById(t.dataset.tab).classList.add("active");
    preview.innerHTML="";
  };
});

/* IMAGE → PDF */
let imgFiles=[];
document.getElementById("imgInput").onchange=e=>{
  imgFiles=[...e.target.files];
  document.getElementById("imgInfo").innerText=
    imgFiles.length+" image(s) selected";
};

document.getElementById("makePdf").onclick=async()=>{
  if(imgFiles.length===0){alert("Select images");return;}
  processing.style.display="block";

  const { jsPDF }=window.jspdf;
  const pdf=new jsPDF("p","mm","a4");
  const pageW=210, pageH=297;

  for(let i=0;i<imgFiles.length;i++){
    const img=new Image();
    img.src=URL.createObjectURL(imgFiles[i]);
    await img.decode();

    const ratio=Math.min(pageW/img.width,pageH/img.height);
    const w=img.width*ratio;
    const h=img.height*ratio;
    const x=(pageW-w)/2;
    const y=(pageH-h)/2;

    if(i>0) pdf.addPage();
    pdf.addImage(img,"JPEG",x,y,w,h);
  }

  /* ✅ filename changed */
  pdf.save("imagetoolify-images.pdf");
  processing.style.display="none";
};

/* PDF → IMAGE */
let pdfFile=null;
document.getElementById("pdfInput").onchange=e=>{
  pdfFile=e.target.files[0];
  document.getElementById("pdfInfo").innerText=pdfFile.name;
};

document.getElementById("makeImages").onclick=async()=>{
  if(!pdfFile){alert("Upload PDF");return;}
  processing.style.display="block";
  preview.innerHTML="";

  const pdfjsLib=window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc=
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

  const pdf=await pdfjsLib.getDocument(URL.createObjectURL(pdfFile)).promise;

  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const viewport=page.getViewport({scale:2});
    const canvas=document.createElement("canvas");
    canvas.width=viewport.width;
    canvas.height=viewport.height;

    await page.render({
      canvasContext:canvas.getContext("2d"),
      viewport
    }).promise;

    const url=canvas.toDataURL("image/jpeg");

    const box=document.createElement("div");
    box.className="image-box";

    const img=document.createElement("img");
    img.src=url;

    const a=document.createElement("a");
    a.href=url;
    /* ✅ filename changed */
    a.download="imagetoolify-page-"+i+".jpg";
    a.className="btn";
    a.innerText="Download Image";

    box.appendChild(img);
    box.appendChild(a);
    preview.appendChild(box);
  }
  processing.style.display="none";
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