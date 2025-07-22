// js/modules/buttonGroups.js

export function initToggleButtonGroups() {
  const toggleGroup = document.getElementById("toggleGroup");
  if (toggleGroup) {
    const buttons = toggleGroup.querySelectorAll(".btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");
      });
    });
  }
}
