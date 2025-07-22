/* ==========================================================================
   [BARU] Logika untuk Dropdown
   ========================================================================== */
function setupDropdowns() {
  // Toggle dropdown saat tombol di-klik
  document.querySelectorAll("[data-toggle-target]").forEach((toggle) => {
    // Pastikan ini hanya berjalan untuk dropdown
    if (!toggle.dataset.toggleTarget.includes("dropdown")) return;

    const targetElement = document.querySelector(toggle.dataset.toggleTarget);
    if (!targetElement) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation(); // Mencegah event 'click' di document langsung menutupnya

      // Tutup semua dropdown lain sebelum membuka yang ini
      document
        .querySelectorAll(".dropdown-menu.is-open")
        .forEach((openDropdown) => {
          if (openDropdown !== targetElement) {
            openDropdown.classList.remove("is-open");
            // Update ARIA pada toggle yang lain
            const otherToggle = document.querySelector(
              `[data-toggle-target="#${openDropdown.id}"]`
            );
            if (otherToggle) {
              otherToggle.setAttribute("aria-expanded", "false");
            }
          }
        });

      // Toggle dropdown saat ini
      const isOpen = targetElement.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
  });

  // Menutup dropdown jika klik di luar area dropdown
  window.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu.is-open").forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      const toggle = document.querySelector(
        `[data-toggle-target="#${dropdown.id}"]`
      );
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Menutup dropdown dengan tombol Escape
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document
        .querySelectorAll(".dropdown-menu.is-open")
        .forEach((dropdown) => {
          dropdown.classList.remove("is-open");
          const toggle = document.querySelector(
            `[data-toggle-target="#${dropdown.id}"]`
          );
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.focus(); // Kembalikan fokus ke tombol
          }
        });
    }
  });
}

