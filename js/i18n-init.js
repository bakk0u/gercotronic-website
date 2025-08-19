document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");

  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: "en",
      supportedLngs: ["en", "es", "de", "fr"],
      backend: { loadPath: "locales/{{lng}}/translation.json" },
      detection: { order: ["localStorage", "querystring", "navigator"], caches: ["localStorage"] }
    })
    .then(() => {
      const cur = (i18next.resolvedLanguage || "en").slice(0, 2);
      if (langSelect) langSelect.value = cur;
      translatePage(document);
    });

  function translatePage(ctx = document) {
    ctx.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = i18next.t(key);
    });
  }

  // Make available to your SPA after it injects HTML
  window.translatePage = translatePage;

  if (langSelect) {
    langSelect.addEventListener("change", async (e) => {
      await i18next.changeLanguage(e.target.value);
      localStorage.setItem("i18nextLng", e.target.value);
      translatePage(document);
    });
  }
});
