export function showRadixStyleAlert(message, type = "info", duration = 5000) {
  const container =
    document.getElementById("alert-container") ||
    (() => {
      const c = document.createElement("div");
      c.id = "alert-container";
      c.style.position = "fixed";
      c.style.top = "1rem";
      c.style.right = "1rem";
      c.style.zIndex = "2000";
      c.style.display = "flex";
      c.style.flexDirection = "column";
      c.style.gap = "0.5rem";
      document.body.appendChild(c);
      return c;
    })();

  const alert = document.createElement("div");
  alert.className = `alert alert--${type} alert--dismissible`;
  alert.setAttribute("role", "alert");

  alert.innerHTML = `
    <div class="alert__icon">💬</div>
    <div class="alert__content">
      <div class="alert__title">${
        type.charAt(0).toUpperCase() + type.slice(1)
      }</div>
      <div class="alert__description">${message}</div>
    </div>
    <button class="alert__close" aria-label="Tutup">✖</button>
  `;

  container.prepend(alert);

  const close = () => {
    alert.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    alert.style.opacity = "0";
    alert.style.transform = "scale(0.95)";
    setTimeout(() => alert.remove(), 300);
  };

  alert.querySelector(".alert__close").addEventListener("click", close);

  if (duration > 0) setTimeout(close, duration);
}
