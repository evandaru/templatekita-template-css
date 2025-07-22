// js/main.js

import { initModals } from "./modal.js";
import { initToggles } from "./toggles.js";
import { initTabs } from "./tabs.js";
import { initThemeSwitcher } from "./themeSwitcher.js";
import { initDarkMode } from "./darkMode.js";
import { initInteractiveDataTable } from "./dataTable.js";
import { initCollapsibleSidebar } from "./sidebar.js";
import { initToggleButtonGroups } from "./buttonGroups.js";
import { initProgressBarDemos } from "./progressBar.js";
import { createBrutalistAlert } from "./alert.js";
import { setupDropdowns } from "./dropDown.js";
import { initRadixToast } from "./toast.js";

(function () {
  "use strict";

  // Agar fungsi alert tetap bisa diakses secara global "plek ketiplek"
  window.createBrutalistAlert = createBrutalistAlert;

  /**
   * Fungsi utama yang akan dijalankan setelah DOM dimuat.
   * Menginisialisasi semua komponen interaktif.
   */
  function init() {
    initRadixToast();
    initModals();
    initToggles();
    initTabs();
    initThemeSwitcher();
    // initDarkMode(); // Tidak perlu dipanggil jika sudah dihandle oleh initThemeSwitcher
    initInteractiveDataTable();
    initCollapsibleSidebar();
    initToggleButtonGroups();
    initProgressBarDemos();
    setupDropdowns();

    // Pastikan library lucide sudah dimuat sebelum ini dipanggil
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Jalankan inisialisasi setelah halaman selesai dimuat
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
