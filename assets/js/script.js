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
   * [MODIFIKASI] Diperbarui agar latar belakang tidak bisa diklik untuk menutup.
   */
  function initModals() {
    const modalTriggers = document.querySelectorAll("[data-modal-target]");
    const modalCloses = document.querySelectorAll("[data-modal-close]");

    // Fungsi helper untuk membuka modal
    function openModal(modal) {
      if (modal) {
        modal.classList.add("is-open");
        // Mencegah body scroll saat modal aktif
        document.body.style.overflow = "hidden";
      }
    }

    // Fungsi helper untuk menutup modal
    function closeModal(modal) {
      if (modal) {
        modal.classList.remove("is-open");
        // Kembalikan scroll pada body HANYA jika tidak ada modal lain yang terbuka
        if (document.querySelectorAll(".modal.is-open").length === 0) {
          document.body.style.overflow = "";
        }
      }
    }

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modalId = trigger.getAttribute("data-modal-target");
        const modal = document.querySelector(modalId);
        openModal(modal);
      });
    });

    modalCloses.forEach((closer) => {
      closer.addEventListener("click", () => {
        const modal = closer.closest(".modal");
        closeModal(modal);
      });
    });

    /*
     * [MODIFIKASI SESUAI PERMINTAAN]
     * Blok kode di bawah ini telah dinonaktifkan dengan mengubahnya menjadi komentar.
     * Tujuannya adalah agar modal TIDAK tertutup saat pengguna mengklik area
     * latar belakang (overlay hitam). Pengguna kini harus secara eksplisit mengklik
     * tombol tutup (X) atau tombol lain dengan atribut `data-modal-close`.
     */
    /*
    document.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("modal") &&
        event.target.classList.contains("is-open")
      ) {
        // Cek jika modal tidak static sebelum menutup
        if (!event.target.hasAttribute('data-modal-static')) {
           closeModal(event.target);
        }
      }
    });
    */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const openModal = document.querySelector(".modal.is-open");
        // Hanya tutup jika modal ada dan tidak memiliki atribut data-modal-static
        if (openModal && !openModal.hasAttribute("data-modal-static")) {
          closeModal(openModal);
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
    ];

    const themePicker = document.getElementById("themeColorPicker");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const settingsToggle = document.getElementById("userSettingsToggle");
    const settingsMenu = document.getElementById("userSettingsMenu");

    if (!themePicker || !darkModeToggle || !settingsToggle || !settingsMenu)
      return;

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

    themes.forEach((theme) => {
      const btn = document.createElement("button");
      btn.className = "theme-color-btn";
      btn.style.backgroundColor = theme.color;
      btn.dataset.theme = theme.name;
      btn.setAttribute("aria-label", `Pilih tema ${theme.name}`);
      btn.addEventListener("click", () => applyColorTheme(theme.name));
      themePicker.appendChild(btn);
    });

    function applyDarkMode(isDark) {
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      localStorage.setItem("ui-dark-mode", isDark);
      darkModeToggle.checked = isDark;
    }

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

  function initInteractiveDataTable() {
    const panel = document.getElementById("interactive-datatable-panel");
    if (!panel) return;

    const searchInput = panel.querySelector("#table-search");
    const entriesSelect = panel.querySelector("#table-entries");
    const tableBody = panel.querySelector("#interactive-tbody");
    const paginationContainer = panel.querySelector("#table-pagination");
    const headers = panel.querySelectorAll(".sortable-header");
    const tableInfo = panel.querySelector("#table-info");

    const originalRows = Array.from(tableBody.querySelectorAll("tr"));
    let currentRows = [...originalRows];
    let currentPage = 1;
    let rowsPerPage = parseInt(entriesSelect?.value || 10);

    function displayPage(page) {
      currentPage = page;
      tableBody.innerHTML = "";
      const totalRows = currentRows.length;
      const start = (page - 1) * rowsPerPage;
      const end = Math.min(start + rowsPerPage, totalRows);
      const paginatedItems = currentRows.slice(start, end);

      paginatedItems.forEach((row) => tableBody.appendChild(row));

      if (totalRows === 0) {
        tableInfo.textContent = "Tidak ada data ditemukan";
        const colCount = headers.length || 4;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" class="text-center text-muted p-4">Tidak ada data ditemukan</td></tr>`;
      } else {
        tableInfo.textContent = `Menampilkan ${start + 1
          } - ${end} dari ${totalRows} entri`;
      }

      setupPaginationControls(totalRows);
    }

    function setupPaginationControls(totalRows) {
      paginationContainer.innerHTML = "";
      const pageCount = Math.ceil(totalRows / rowsPerPage);
      if (pageCount <= 1 && totalRows > 0) {
        const pageLi = document.createElement("li");
        pageLi.className = "page-item active";
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
        paginationContainer.appendChild(pageLi);
        return;
      } else if (totalRows === 0) {
        return;
      }

      const prevLi = document.createElement("li");
      prevLi.className = `page-item${currentPage === 1 ? " disabled" : ""}`;
      prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1
        }" aria-label="Sebelumnya">«</a>`;
      paginationContainer.appendChild(prevLi);

      for (let i = 1; i <= pageCount; i++) {
        const pageLi = document.createElement("li");
        pageLi.className = `page-item${i === currentPage ? " active" : ""}`;
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        paginationContainer.appendChild(pageLi);
      }

      const nextLi = document.createElement("li");
      nextLi.className = `page-item${currentPage === pageCount ? " disabled" : ""
        }`;
      nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1
        }" aria-label="Berikutnya">»</a>`;
      paginationContainer.appendChild(nextLi);
    }

    function updateTable() {
      const searchTerm = searchInput.value.toLowerCase();

      currentRows = originalRows.filter((row) => {
        return row.textContent.toLowerCase().includes(searchTerm);
      });

      const activeSorter = panel.querySelector(".sorted-asc, .sorted-desc");
      if (activeSorter) {
        sortRows(activeSorter, false);
      }

      displayPage(1);
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

    searchInput.addEventListener("input", updateTable);

    if (entriesSelect) {
      entriesSelect.addEventListener("change", () => {
        rowsPerPage = parseInt(entriesSelect.value);
        displayPage(1);
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

    displayPage(1);
  }

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
    alertEl.className = `alert alert-${type}`;
    alertEl.setAttribute("role", "alert");

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
    const toggles = document.querySelectorAll(".sidebar-collapsible__toggle");
    if (toggles.length === 0) return;

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        const parent = this.closest(".sidebar-collapsible");
        if (parent) {
          parent.classList.toggle("is-open");
        }
      });
    });

    const activeSubLink = document.querySelector(
      ".sidebar-collapsible__content a.active"
    );

    if (activeSubLink) {
      const parentMenu = activeSubLink.closest(".sidebar-collapsible");
      if (parentMenu) {
        parentMenu.classList.add("is-open");
      }
    }
  }

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