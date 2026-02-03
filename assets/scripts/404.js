const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.onclick = () => {
  menuBtn.classList.toggle("active");
  navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
};