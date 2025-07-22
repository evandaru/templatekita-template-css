export function initRadixToast() {
  const showToastBtn = document.getElementById("showToastBtn");
  const toastContainer = document.getElementById("toastContainer");

  // Pastikan elemen yang diperlukan ada di halaman
  if (!showToastBtn || !toastContainer) {
    // console.warn("Elemen untuk Toast Radix (showToastBtn atau toastContainer) tidak ditemukan.");
    return;
  }

  // Data sampel untuk toast
  const toastMessages = [
    {
      title: "Acara Ditambahkan",
      description: "Rapat tim telah dijadwalkan pada hari Jumat pukul 10:00.",
    },
    {
      title: "Pembaruan Berhasil",
      description: "Profil Anda telah berhasil diperbarui.",
    },
    {
      title: "Notifikasi Baru",
      description: "Anda memiliki 3 pesan yang belum dibaca.",
    },
    {
      title: "Gagal Mengunggah",
      description: "Ukuran file terlalu besar. Maksimum 5MB.",
    },
  ];

  function createToast(title, description, duration = 5000) {
    // 1. Buat elemen toast
    const toastElement = document.createElement("li");
    toastElement.className = "toast";
    // Atur durasi auto-close melalui CSS variable
    toastElement.style.setProperty("--toast-duration", `${duration / 1000}s`);

    // 2. Isi konten toast
    toastElement.innerHTML = `
          <div class="toast-content">
              <p class="toast-title">${title}</p>
              <p class="toast-description">${description}</p>
          </div>
          <button class="toast-close-button" aria-label="Tutup">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
          </button>
      `;

    // 3. Tambahkan ke container
    toastContainer.appendChild(toastElement);

    const closeButton = toastElement.querySelector(".toast-close-button");

    // Fungsi untuk menghapus toast saat tombol close diklik
    const removeToast = () => {
      // Tambahkan kelas untuk memicu animasi keluar manual
      toastElement.classList.add("closing");

      // Hapus elemen dari DOM setelah animasi selesai
      toastElement.addEventListener(
        "animationend",
        () => {
          if (toastElement.parentElement) {
            toastElement.remove();
          }
        },
        { once: true }
      );
    };

    // 4. Event listener untuk tombol close
    closeButton.addEventListener("click", removeToast);

    // 5. Event listener untuk auto-remove setelah animasi CSS selesai
    // Ini akan menangani penghapusan otomatis setelah durasi yang ditentukan.
    toastElement.addEventListener(
      "animationend",
      (event) => {
        // Pastikan ini adalah akhir dari animasi `fadeOut` dan elemen masih ada
        if (event.animationName === "fadeOut" && toastElement.parentElement) {
          toastElement.remove();
        }
      },
      { once: true }
    );
  }

  // Event listener untuk tombol utama
  showToastBtn.addEventListener("click", () => {
    const randomMessage =
      toastMessages[Math.floor(Math.random() * toastMessages.length)];
    createToast(randomMessage.title, randomMessage.description);
  });
}
