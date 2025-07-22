// js/modules/themeSwitcher.js

export function initThemeSwitcher() {
  const themes = [
    { name: "blue", color: "hsl(212, 100%, 48%)" },
    { name: "green", color: "hsl(142, 76%, 36%)" },
    { name: "orange", color: "hsl(25, 95%, 53%)" },
    { name: "violet", color: "hsl(262, 85%, 58%)" },
    { name: "rose", color: "hsl(340, 82%, 52%)" },
    { name: "black", color: "hsl(0, 0%, 10%)" },
    { name: "gray", color: "hsl(0, 0%, 50%)" },
    { name: "yellow", color: "hsl(45, 100%, 50%)" },
  ];

  const themePicker = document.getElementById("themeColorPicker");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const settingsToggle = document.getElementById("userSettingsToggle");
  const settingsMenu = document.getElementById("userSettingsMenu");

  if (!themePicker || !darkModeToggle || !settingsToggle || !settingsMenu)
    return;

  // --- Fungsi untuk Warna Tema ---
  function applyColorTheme(themeName) {
    document.documentElement.setAttribute("data-color-theme", themeName);
    localStorage.setItem("ui-color-theme", themeName);
    updateActiveColorButton(themeName);
  }

  function updateActiveColorButton(activeThemeName) {
    themePicker.querySelectorAll(".theme-color-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.theme === activeThemeName);
    });
  }

  // Buat tombol-tombol warna
  themes.forEach((theme) => {
    console.log("Generate button untuk tema:", theme.name);
    const btn = document.createElement("button");
    btn.className = "theme-color-btn";
    btn.style.backgroundColor = theme.color;
    btn.dataset.theme = theme.name;
    btn.setAttribute("aria-label", `Pilih tema ${theme.name}`);
    btn.addEventListener("click", () => applyColorTheme(theme.name));
    themePicker.appendChild(btn);
  });

  // --- Fungsi untuk Mode Malam ---
  function applyDarkMode(isDark) {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("ui-dark-mode", isDark);
    darkModeToggle.checked = isDark;
  }

  // --- Event Listeners ---
  darkModeToggle.addEventListener("change", () => {
    applyDarkMode(darkModeToggle.checked);
  });

  settingsToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle("is-open");
  });

  document.addEventListener("click", (e) => {
    if (
      settingsMenu.classList.contains("is-open") &&
      !settingsMenu.contains(e.target) &&
      !settingsToggle.contains(e.target)
    ) {
      settingsMenu.classList.remove("is-open");
    }
  });

  // --- Inisialisasi saat memuat halaman ---
  const savedColorTheme = localStorage.getItem("ui-color-theme") || "blue";
  applyColorTheme(savedColorTheme);

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedDarkMode =
    localStorage.getItem("ui-dark-mode") === null
      ? prefersDark
      : localStorage.getItem("ui-dark-mode") === "true";
  applyDarkMode(savedDarkMode);
}
