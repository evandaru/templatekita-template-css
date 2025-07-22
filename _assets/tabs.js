// js/modules/tabs.js

export function initTabs() {
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
