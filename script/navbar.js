hamburger = document.querySelector(".hamburger");
hamburger.onclick = function () {
  navBar = document.querySelector(".nav-bar");
  navBar.classList.toggle("active");
};
// _____
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});
const hiddenXElements = document.querySelectorAll(".hidden-x");
hiddenXElements.forEach((el) => observer.observe(el));

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

const observerTitle = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show-title");
    } else {
      entry.target.classList.remove("show-title");
    }
  });
});

const hiddenTitleElements = document.querySelectorAll(".hidden-title");
hiddenTitleElements.forEach((el) => observerTitle.observe(el));