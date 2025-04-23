import "./style.css";

const screens = document.querySelectorAll("section");
let index = 0;

function update(index) {
  screens.forEach((screen, i) => {
    if (i === index) {
      screen.classList.add("active");
    } else {
      screen.classList.remove("active");
    }
  });
}
setInterval(() => {
  index++;
  if (index >= screens.length) {
    index = 0;
  }
  update(index);
}, 2000);
