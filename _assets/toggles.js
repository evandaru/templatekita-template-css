// js/modules/toggles.js

export function initToggles() {
  const toggleTriggers = document.querySelectorAll("[data-toggle-target]");

  toggleTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (event) {
      // Jangan cegah default untuk checkbox/radio
      if (this.type !== "checkbox" && this.type !== "radio") {
        event.preventDefault();
      }

      const targetSelector = this.getAttribute("data-toggle-target");
      const targetElement = document.querySelector(targetSelector);
      const toggleClass = this.getAttribute("data-toggle-class") || "is-active";

      if (targetElement) {
        targetElement.classList.toggle(toggleClass);
      }

      // Hanya toggle kelas pada trigger jika bukan bagian dari form-check (seperti dark mode)
      if (!this.closest(".form-check")) {
        this.classList.toggle(toggleClass);
      }
    });
  });
}
