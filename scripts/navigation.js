// Toggle navigation menu on small screens
const menuButton = document.querySelector("#menu");
const navLinks = document.querySelector("#nav-links");

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuButton.classList.toggle("open");
});


