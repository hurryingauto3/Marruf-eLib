const dropdown = document.querySelector(".dropdown");
const dropdownContent = document.querySelector(".dropdown-content");
const dropdownBtn = document.querySelector(".dropdown-btn");

dropdownBtn.addEventListener("click", function () {
  dropdown.classList.toggle("show");
});
