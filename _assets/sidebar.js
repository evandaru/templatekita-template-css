// js/modules/sidebar.js

export function initCollapsibleSidebar() {
  // 1. Logika untuk membuat menu bisa dilipat (collapsible)
  const toggles = document.querySelectorAll(".sidebar-collapsible__toggle");
  if (toggles.length === 0) return; // Keluar jika tidak ada menu collapsible

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function (event) {
      // Mencegah link '#' melakukan navigasi atau lompat ke atas halaman
      event.preventDefault();

      // Cari elemen induk terdekat dengan kelas .sidebar-collapsible
      const parent = this.closest(".sidebar-collapsible");

      // Jika ditemukan, tambahkan atau hapus kelas 'is-open'
      if (parent) {
        parent.classList.toggle("is-open");
      }
    });
  });

  // 2. Logika untuk membuka menu yang relevan secara otomatis saat halaman dimuat
  // Cari link sub-menu yang memiliki kelas 'active'
  const activeSubLink = document.querySelector(
    ".sidebar-collapsible__content a.active"
  );

  if (activeSubLink) {
    // Cari elemen induk .sidebar-collapsible dari link aktif tersebut
    const parentMenu = activeSubLink.closest(".sidebar-collapsible");
    if (parentMenu) {
      // Tambahkan kelas 'is-open' agar menu tersebut terbuka
      parentMenu.classList.add("is-open");
    }
  }
}
