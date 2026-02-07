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
  status.style.color = "";

  const data = new FormData(form);

  try {
    const res = await fetch("https://formspree.io/f/mqedkzoe", {
      method: "POST",
      body: data,
      headers: {
        "Accept": "application/json"
      }
    });

    const result = await res.json(); // 🔴 THIS WAS MISSING

    if (res.ok) {
      form.reset();
      status.textContent = "Thank you for contacting us. We will reply you soon.";
      status.style.color = "green";

      setTimeout(() => {
        status.textContent = "";
      }, 5000);

    } else {
      // 🔥 REAL ERROR MESSAGE FROM FORMSPREE
      status.textContent = result.error || "Submission failed. Please check form fields.";
      status.style.color = "red";
    }

  } catch (error) {
    status.textContent = "Network error. Please try again later.";
    status.style.color = "red";
  }
});
