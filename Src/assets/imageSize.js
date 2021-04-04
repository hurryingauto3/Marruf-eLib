const images = document.querySelectorAll(".row img");
const row = document.querySelector(".row");

let readyStateCheckInterval = setInterval(function () {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    init();
  }
}, 10);

window.addEventListener("resize", init);

function init() {
  width = row.clientWidth / 10;
  for (i = 0; i < images.length; i++) {
    images[i].parentElement.style.height = width + "px";
    images[i].parentElement.style.width = width + "px";
  }
}
