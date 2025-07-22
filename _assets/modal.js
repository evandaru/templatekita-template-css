// js/modules/modal.js

export function initModals() {
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
