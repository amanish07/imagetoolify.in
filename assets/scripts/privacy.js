

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