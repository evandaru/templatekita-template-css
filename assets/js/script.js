/* ==========================================================================
   Modern UI Kit JS v1.1
   Skrip pendamping untuk Modern UI Kit (diadaptasi dari BrutalistCSS).
   Ringan, tanpa dependensi, dan berbasis atribut data.
   ========================================================================== */

(function () {
  "use strict";

  /**
   * Fungsi utama yang akan dijalankan setelah DOM dimuat.
   * Menginisialisasi semua komponen interaktif.
   */
  function init() {
    initModals();
    initToggles();
    initTabs();
    initThemeSwitcher();
    initDarkMode();
    initInteractiveDataTable(); // [BARU] Menginisialisasi datatable lengkap
    initCollapsibleSidebar();
    initToggleButtonGroups(); // [BARU] Memisahkan fungsionalitas toggle button group
    initProgressBarDemos(); // [BARU] Memisahkan fungsionalitas demo progress bar
    lucide.createIcons();
    // Fungsi untuk Alert tidak diinisialisasi di sini,
    // karena ia dipanggil secara dinamis.
  }

  /**
   * Inisialisasi semua fungsionalitas Modal.
   */
  function initModals() {
    const modalTriggers = document.querySelectorAll("[data-modal-target]");
    const modalCloses = document.querySelectorAll("[data-modal-close]");

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modalId = trigger.getAttribute("data-modal-target");
        const modal = document.querySelector(modalId);
        if (modal) {
          modal.classList.add("is-open");
        }
      });
    });

    modalCloses.forEach((closer) => {
      closer.addEventListener("click", () => {
        const modal = closer.closest(".modal");
        if (modal) {
          modal.classList.remove("is-open");
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("modal") &&
        event.target.classList.contains("is-open")
      ) {
        event.target.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const openModal = document.querySelector(".modal.is-open");
        if (openModal) {
          openModal.classList.remove("is-open");
        }
      }
    });
  }

  /**
   * Inisialisasi fungsionalitas Dark Mode.
   */
  function initDarkMode() {
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

  /**
   * Inisialisasi fungsionalitas Toggle (untuk sidebar, dropdown, dll).
   */
  function initToggles() {
    const toggleTriggers = document.querySelectorAll("[data-toggle-target]");

    toggleTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function (event) {
        // Jangan cegah default untuk checkbox/radio
        if (this.type !== "checkbox" && this.type !== "radio") {
          event.preventDefault();
        }

        const targetSelector = this.getAttribute("data-toggle-target");
        const targetElement = document.querySelector(targetSelector);
        const toggleClass =
          this.getAttribute("data-toggle-class") || "is-active";

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

  /**
   * Inisialisasi fungsionalitas Tab.
   */
  function initTabs() {
    const tabContainers = document.querySelectorAll("[data-tabs]");

    tabContainers.forEach((container) => {
      const tabLinks = container.querySelectorAll("[data-tab]");
      const tabContents = container.querySelectorAll("[data-tab-content]");

      if (tabLinks.length > 0) {
        const activeTab =
          container.querySelector("[data-tab].active") || tabLinks[0];
        const activeContentId = activeTab.getAttribute("data-tab");

        tabLinks.forEach((link) => link.classList.remove("active"));
        activeTab.classList.add("active");

        tabContents.forEach((content) => {
          if (content.getAttribute("data-tab-content") === activeContentId) {
            content.classList.remove("d-none");
          } else {
            content.classList.add("d-none");
          }
        });
      }

      container.addEventListener("click", (event) => {
        const clickedTab = event.target.closest("[data-tab]");
        if (!clickedTab) return;

        event.preventDefault();

        tabLinks.forEach((link) => link.classList.remove("active"));
        clickedTab.classList.add("active");

        tabContents.forEach((content) => content.classList.add("d-none"));

        const contentId = clickedTab.getAttribute("data-tab");
        const targetContent = container.querySelector(
          `[data-tab-content="${contentId}"]`
        );
        if (targetContent) {
          targetContent.classList.remove("d-none");
        }
      });
    });
  }

  function initThemeSwitcher() {
    const themes = [
      { name: "blue", color: "hsl(212, 100%, 48%)" },
      { name: "green", color: "hsl(142, 76%, 36%)" },
      { name: "orange", color: "hsl(25, 95%, 53%)" },
      { name: "violet", color: "hsl(262, 85%, 58%)" },
      { name: "rose", color: "hsl(340, 82%, 52%)" },
      { name: "black", color: "hsl(0, 0%, 10%)" },
      // { name: "gray", color: "hsl(0, 0%, 50%)" },
      // { name: "yellow", color: "hsl(45, 100%, 50%)" },
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
        btn.classList.toggle(
          "is-active",
          btn.dataset.theme === activeThemeName
        );
      });
    }

    // Buat tombol-tombol warna
    themes.forEach((theme) => {
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

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedDarkMode =
      localStorage.getItem("ui-dark-mode") === null
        ? prefersDark
        : localStorage.getItem("ui-dark-mode") === "true";
    applyDarkMode(savedDarkMode);
  }

  /**
   * [BARU] Menginisialisasi fungsionalitas tabel interaktif termasuk
   * Pencarian, Pengurutan, dan Pagination.
   */
  function initInteractiveDataTable() {
    const panel = document.getElementById("interactive-datatable-panel");
    if (!panel) return;

    const searchInput = panel.querySelector("#table-search");
    const entriesSelect = panel.querySelector("#table-entries");
    const tableBody = panel.querySelector("#interactive-tbody");
    const paginationContainer = panel.querySelector("#table-pagination");
    const headers = panel.querySelectorAll(".sortable-header");
    const tableInfo = panel.querySelector("#table-info");

    // Simpan semua baris asli sekali
    const originalRows = Array.from(tableBody.querySelectorAll("tr"));
    let currentRows = [...originalRows];
    let currentPage = 1;
    let rowsPerPage = parseInt(entriesSelect?.value || 10); // Ambil nilai dari select, default 10

    function displayPage(page) {
      currentPage = page;
      tableBody.innerHTML = "";
      const totalRows = currentRows.length;
      const start = (page - 1) * rowsPerPage;
      const end = Math.min(start + rowsPerPage, totalRows);
      const paginatedItems = currentRows.slice(start, end);

      // Tambahkan baris ke tabel
      paginatedItems.forEach((row) => tableBody.appendChild(row));

      // Perbarui informasi jumlah data
      if (totalRows === 0) {
        tableInfo.textContent = "Tidak ada data ditemukan";
        const colCount = headers.length || 4;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" class="text-center text-muted p-4">Tidak ada data ditemukan</td></tr>`;
      } else {
        tableInfo.textContent = `Menampilkan ${
          start + 1
        } - ${end} dari ${totalRows} entri`;
      }

      // Perbarui kontrol pagination
      setupPaginationControls(totalRows);
    }

    function setupPaginationControls(totalRows) {
      paginationContainer.innerHTML = "";
      const pageCount = Math.ceil(totalRows / rowsPerPage);
      if (pageCount <= 1 && totalRows > 0) {
        // Jika hanya satu halaman, tetap tampilkan tombol halaman 1
        const pageLi = document.createElement("li");
        pageLi.className = "page-item active";
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
        paginationContainer.appendChild(pageLi);
        return;
      } else if (totalRows === 0) {
        return; // Tidak ada pagination jika tidak ada data
      }

      // Tombol "Previous"
      const prevLi = document.createElement("li");
      prevLi.className = `page-item${currentPage === 1 ? " disabled" : ""}`;
      prevLi.innerHTML = `<a class="page-link" href="#" data-page="${
        currentPage - 1
      }" aria-label="Sebelumnya">«</a>`;
      paginationContainer.appendChild(prevLi);

      // Tombol Halaman
      for (let i = 1; i <= pageCount; i++) {
        const pageLi = document.createElement("li");
        pageLi.className = `page-item${i === currentPage ? " active" : ""}`;
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        paginationContainer.appendChild(pageLi);
      }

      // Tombol "Next"
      const nextLi = document.createElement("li");
      nextLi.className = `page-item${
        currentPage === pageCount ? " disabled" : ""
      }`;
      nextLi.innerHTML = `<a class="page-link" href="#" data-page="${
        currentPage + 1
      }" aria-label="Berikutnya">»</a>`;
      paginationContainer.appendChild(nextLi);
    }

    function updateTable() {
      const searchTerm = searchInput.value.toLowerCase();

      // Filter berdasarkan pencarian
      currentRows = originalRows.filter((row) => {
        return row.textContent.toLowerCase().includes(searchTerm);
      });

      // Terapkan sorting yang sedang aktif (jika ada)
      const activeSorter = panel.querySelector(".sorted-asc, .sorted-desc");
      if (activeSorter) {
        sortRows(activeSorter, false); // Sort tanpa update DOM
      }

      displayPage(1); // Kembali ke halaman pertama setelah search/sort
    }

    function sortRows(header, shouldUpdateDOM = true) {
      const index = Array.from(header.parentElement.children).indexOf(header);
      const sortDir = header.dataset.sortDir;
      const isNumeric = !isNaN(
        parseFloat(currentRows[0]?.cells[index]?.textContent)
      );

      currentRows.sort((a, b) => {
        let aText = a.cells[index].textContent.trim();
        let bText = b.cells[index].textContent.trim();
        let aVal = isNumeric
          ? parseFloat(aText.replace(/,/g, ""))
          : aText.toLowerCase();
        let bVal = isNumeric
          ? parseFloat(bText.replace(/,/g, ""))
          : bText.toLowerCase();

        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });

      if (shouldUpdateDOM) {
        headers.forEach((h) => {
          if (h !== header) {
            h.classList.remove("sorted-asc", "sorted-desc");
            h.dataset.sortDir = "asc";
          }
        });
        header.classList.remove("sorted-asc", "sorted-desc");
        header.classList.add(sortDir === "asc" ? "sorted-asc" : "sorted-desc");
        header.dataset.sortDir = sortDir === "asc" ? "desc" : "asc";
        displayPage(1);
      }
    }

    // --- Event Listeners ---
    searchInput.addEventListener("input", updateTable);

    // Event listener untuk perubahan jumlah entri
    if (entriesSelect) {
      entriesSelect.addEventListener("change", () => {
        rowsPerPage = parseInt(entriesSelect.value);
        displayPage(1); // Kembali ke halaman pertama
      });
    }

    headers.forEach((header) => {
      header.addEventListener("click", () => sortRows(header));
    });

    paginationContainer.addEventListener("click", function (e) {
      e.preventDefault();
      const link = e.target.closest(".page-link");
      if (
        link &&
        !link.parentElement.classList.contains("disabled") &&
        !link.parentElement.classList.contains("active")
      ) {
        const page = parseInt(link.dataset.page, 10);
        if (!isNaN(page)) {
          displayPage(page);
        }
      }
    });

    // --- Initial Load ---
    displayPage(1);
  }

  /**
   * Fungsi GLOBAL untuk membuat Alert secara dinamis.
   */
  window.createBrutalistAlert = function (
    message,
    type = "info",
    duration = 5000
  ) {
    let container = document.getElementById("alert-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "alert-container";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.zIndex = "2000";
      container.style.width = "350px";
      container.style.maxWidth = "90%";
      document.body.appendChild(container);
    }

    const alertEl = document.createElement("div");
    // Menggunakan kelas .alert dari CSS yang sudah di-re-skin
    alertEl.className = `alert alert-${type}`;
    alertEl.setAttribute("role", "alert");

    // Menggunakan tombol close yang sudah ada gayanya
    alertEl.innerHTML = `<div class="d-flex justify-content-between align-items-center"><span>${message}</span><button class="btn-close" aria-label="Tutup"></button></div>`;

    container.prepend(alertEl);

    const closeAlert = () => {
      alertEl.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      alertEl.style.opacity = "0";
      alertEl.style.transform = "scale(0.95)";
      setTimeout(() => alertEl.remove(), 300);
    };

    alertEl.querySelector(".btn-close").addEventListener("click", closeAlert);

    if (duration > 0) {
      setTimeout(closeAlert, duration);
    }
  };

  /**
   * [BARU] Inisialisasi untuk Button Toggle Groups.
   */
  function initToggleButtonGroups() {
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
  function initCollapsibleSidebar() {
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

  /**
   * [BARU] Inisialisasi untuk Demo Progress Bar.
   */
  function initProgressBarDemos() {
    const animateBtn = document.getElementById("animate-btn");
    if (animateBtn) {
      animateBtn.addEventListener("click", () => {
        const progressGroup = document.getElementById(
          "animated-progress-group"
        );
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

  // Jalankan inisialisasi setelah halaman selesai dimuat
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
