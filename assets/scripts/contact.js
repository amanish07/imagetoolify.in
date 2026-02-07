const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  navMenu.classList.toggle("open");
});

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  status.textContent = "Sending message...";
  status.style.color = "";

  const data = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/mqedkzoe", {
      method: "POST",
      body: data,
      headers: {
        "Accept": "application/json"
      }
    });

    const result = await response.json();

    if (response.ok) {
      form.reset();
      status.textContent = "Thank you for contacting us. We will reply you soon.";
      status.style.color = "green";

      setTimeout(() => {
        status.textContent = "";
      }, 5000);
    } else {
      status.textContent = result.error || "Submission failed. Please try again.";
      status.style.color = "red";
    }

  } catch (err) {
    status.textContent = "Network error. Please try again later.";
    status.style.color = "red";
  }
});
