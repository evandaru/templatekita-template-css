// js/modules/dataTable.js

export function initInteractiveDataTable() {
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
