// js/modules/darkMode.js

export function initDarkMode() {
  const toggle = document.getElementById("darkModeToggle");
  if (!toggle) return;

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      toggle.checked = true;
    } else {
      document.documentElement.removeAttribute("data-theme");
      toggle.checked = false;
    }
  };

  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  applyTheme(savedTheme);

  toggle.addEventListener("change", function () {
    const newTheme = this.checked ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });
}
