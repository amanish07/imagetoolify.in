const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.onclick = () => {
  menuBtn.classList.toggle("active");
  navMenu.classList.toggle("open");
};

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "Sending message...";

  const data = new FormData(form);

  try {
    const res = await fetch("https://formspree.io/f/mqedkzoe", {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (res.ok) {
      form.reset();
      status.textContent = "Thank you for contacting us. We will reply you soon.";

      setTimeout(() => {
        status.textContent = "";
      }, 10000);
    } else {
      status.textContent = "Something went wrong. Please try again.";
    }
  } catch {
    status.textContent = "Network error. Please try later.";
  }
});
