// Tells the CSS that JavaScript is running (so "reveal" items can fade in)
document.documentElement.classList.add("js");

const $ = (id) => document.getElementById(id); // short helper for getElementById

// Small message box at the bottom of the screen
function showToast(text) {
  const toast = $("toast");
  toast.textContent = text;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

// ---------- Mobile hamburger menu ----------
const menuBtn = $("menuBtn");
const navMenu = $("navMenu");
menuBtn.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
// Close the menu after choosing a link
navMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// ---------- Navbar shadow + back-to-top button on scroll ----------
const navbar = $("navbar");
const toTop = $("toTop");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  toTop.classList.toggle("visible", window.scrollY > 600);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Highlight the nav link of the section you are viewing ----------
const navLinks = navMenu.querySelectorAll("ul a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Scroll animations (fade in once) ----------
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Menu category filter ----------
const chips = document.querySelectorAll(".chip");
chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    document.querySelectorAll(".dish").forEach((dish) => {
      // Hide a dish unless "All" is chosen or its category matches
      dish.classList.toggle("hide", filter !== "all" && dish.dataset.cat !== filter);
    });
  })
);

// ---------- Order Now button (demo only) ----------
$("orderBtn").addEventListener("click", () =>
  showToast("Demo project: online ordering is not available.")
);

// ---------- Reservation form ----------
const form = $("bookForm");

// Don't allow past dates: set the minimum date to today
const today = new Date();
const todayText = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
$("date").min = todayText;

// Shows or clears the error under one field. Returns true if the field is OK.
function setError(id, message) {
  $(id + "Error").textContent = message;
  $(id).classList.toggle("invalid", message !== "");
  return message === "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const name = $("name").value.trim();
  const email = $("email").value.trim();
  const phone = $("phone").value.trim();
  const date = $("date").value;
  const time = $("time").value;
  const guests = Number($("guests").value);

  // Each check returns true (valid) or false (invalid)
  const results = [
    setError("name", name.length < 2 ? "Please enter your name." : ""),
    setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email."),
    setError("phone", /^[+\d][\d\s-]{6,14}$/.test(phone) ? "" : "Please enter a valid phone number."),
    setError("date", date === "" ? "Please choose a date." : date < todayText ? "Please choose today or a later date." : ""),
    setError("time", time === "" ? "Please choose a time." : ""),
    setError("guests", guests >= 1 && guests <= 12 ? "" : "Guests must be between 1 and 12."),
  ];

  const status = $("formStatus");
  if (results.every(Boolean)) {
    // No backend: nothing is sent
    status.textContent = "Thanks! This is a demo, so no table was actually booked.";
    form.reset();
    $("guests").value = 2;
  } else {
    status.textContent = "";
  }
});

// ---------- Footer year ----------
$("year").textContent = new Date().getFullYear();
