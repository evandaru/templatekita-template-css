// js/modules/progressBar.js

export function initProgressBarDemos() {
  const animateBtn = document.getElementById("animate-btn");
  if (animateBtn) {
    animateBtn.addEventListener("click", () => {
      const progressGroup = document.getElementById("animated-progress-group");
      const innerBars = progressGroup.querySelectorAll(".progress-bar-inner");

      innerBars.forEach((bar) => {
        bar.style.width = "10%";
        setTimeout(() => {
          const targetWidth = bar.getAttribute("data-value") || "75";
          bar.style.width = targetWidth + "%";
        }, 100);
      });
    });
  }
}
