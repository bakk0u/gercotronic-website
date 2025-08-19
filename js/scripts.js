// ==============================
// Simple in-memory page cache (path -> HTML string)
// ==============================
const pageCache = new Map();
const MAX_CACHE = 10; // keep it small + fast

// Base path of the current folder (works on GitHub Pages subpaths)
// Always point to the repo root (works locally and on GitHub Pages)
const REPO = "gercotronic-website";
const BASE = location.hostname.endsWith("github.io") ? `/${REPO}/` : "/";

function cacheSet(path, html) {
  if (pageCache.has(path)) pageCache.delete(path); // refresh order
  pageCache.set(path, html);
  if (pageCache.size > MAX_CACHE) {
    // evict oldest (very lightweight LRU)
    const firstKey = pageCache.keys().next().value;
    pageCache.delete(firstKey);
  }
}

// ==============================
// Menu
// ==============================
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
}

// ==============================
// Register ScrollTrigger once
// ==============================
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// ==============================
// Cleanup (prevents lag on navigation)
// ==============================
function cleanupAnimations() {
  try {
    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
    gsap.killTweensOf([
      ".service-card",
      ".hero-content",
      ".hero h1",
      ".hero p",
      ".hero-buttons a",
      ".why-item",
      ".about-details h2",
      ".about-details p",
      ".timeline .event",
      ".about-cta h2",
      ".about-cta a",
    ]);
  } catch (e) {
    console.warn("cleanupAnimations warning:", e);
  }
}

// ==============================
// Animations (GSAP + ScrollTrigger)
// ==============================
function runAnimations() {
  // mouse-follow glow for service cards (no duplicate listeners)
  document.querySelectorAll(".service-card").forEach((card) => {
    card.onmousemove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };
  });

  // Hero section
  if (document.querySelector(".hero-content")) {
    gsap.to(".hero-content", {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5,
      ease: "power2.out",
    });
  }
  if (document.querySelector(".hero h1")) {
    gsap.from(".hero h1", { y: -50, opacity: 0, duration: 1, delay: 0.7 });
  }
  if (document.querySelector(".hero p")) {
    gsap.from(".hero p", { y: -30, opacity: 0, duration: 1, delay: 1 });
  }
  if (document.querySelector(".hero-buttons a")) {
    gsap.from(".hero-buttons a", {
      scale: 0.8,
      opacity: 0,
      stagger: 0.2,
      duration: 0.5,
      delay: 1.2,
    });
  }

  // Services page: robust per-card reveal
  if (document.querySelector(".services-grid")) {
    gsap.utils.toArray(".service-card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.9, visibility: "hidden" },
        {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          scale: 1,
          visibility: "visible",
          duration: 0.8,
          delay: i * 0.2,
          ease: "power2.out",
        }
      );
    });
  }

  // Why section
  if (document.querySelector(".why-item")) {
    gsap.from(".why-item", {
      scrollTrigger: {
        trigger: ".why-choose-us",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    });
  }

  // ABOUT PAGE
  if (document.querySelector(".headline")) {
    gsap.from(".headline", {
      opacity: 0,
      y: -50,
      duration: 1,
      delay: 0.3,
      ease: "power2.out",
    });
  }
  if (document.querySelector(".tagline")) {
    gsap.from(".tagline", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.6,
      ease: "power2.out",
    });
  }
  if (document.querySelector(".about-details")) {
    gsap.from(".about-details h2, .about-details p", {
      scrollTrigger: { trigger: ".about-details", start: "top 80%" },
      opacity: 0,
      y: 40,
      stagger: 0.3,
      duration: 1,
    });
  }
  if (document.querySelector(".milestones")) {
    gsap.from(".timeline .event", {
      scrollTrigger: { trigger: ".milestones", start: "top 80%" },
      opacity: 0,
      x: -30,
      stagger: 0.2,
      duration: 1,
    });
  }
  if (document.querySelector(".about-cta")) {
    gsap.from(".about-cta h2, .about-cta a", {
      scrollTrigger: { trigger: ".about-cta", start: "top 80%" },
      opacity: 0,
      y: 20,
      duration: 1,
    });
  }
}

// ==============================
// Vanta (NET) Background
// ==============================
let vantaEffect = null;

function runVantaEffect() {
  if (vantaEffect && typeof vantaEffect.destroy === "function") {
    vantaEffect.destroy();
    vantaEffect = null;
  }

  // Home hero
  const hero = document.getElementById("vanta-hero");
  if (hero) {
    vantaEffect = VANTA.NET({
      el: hero,
      mouseControls: true,
      touchControls: true,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x2c3ca6,
      backgroundColor: 0x111111,
      points: 12.0,
      maxDistance: 20.0,
      spacing: 18.0,
      onLoad: () => {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      },
    });
  }

  // Services section
  const services = document.getElementById("vanta-services");
  if (services) {
    vantaEffect = VANTA.NET({
      el: services,
      mouseControls: true,
      touchControls: true,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x2c3ca6,
      backgroundColor: 0x111111,
      points: 12.0,
      maxDistance: 20.0,
      spacing: 18.0,
      onLoad: () => {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      },
    });
  }
}

// ==============================
// SPA Router (Event Delegation + History)
// ==============================
window.addEventListener("load", () => {
  const mainSection = document.getElementById("main-content");

  // -------- helpers --------
  const normalize = (href) => {
    if (!href) return "";
    // strip origin if present
    let h = href.replace(location.origin, "");
    // strip BASE prefix when running on GitHub Pages
    if (h.startsWith(BASE)) h = h.slice(BASE.length);
    // remove leading ./ or / and strip any query/hash
    h = h.replace(/^(?:\.\/|\/)+/, "").split(/[?#]/)[0];
    return h;
  };

  const isInternalHTML = (href) => {
    if (!href) return false;
    if (
      /^(https?:)?\/\//.test(href) ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      return false;
    }
    const h = normalize(href);
    return h.startsWith("pages/") || h.endsWith(".html");
  };

  const setActiveLink = (href) => {
    const h = normalize(href);
    document.querySelectorAll("a[href]").forEach((a) => {
      const ah = normalize(a.getAttribute("href"));
      a.classList.toggle("active", ah === h);
    });
  };

  let navInFlight = false;

  async function loadPage(href, push = true, { bypassCache = false } = {}) {
    if (navInFlight) return;
    navInFlight = true;

    const path = normalize(href);
    const fetchURL = new URL(path, `${location.origin}${BASE}`).href;

    try {
      // ✅ Serve from cache if available
      let html;
      if (!bypassCache && pageCache.has(path)) {
        html = pageCache.get(path);
      } else {
        const res = await fetch(fetchURL, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Page not found: ${path}`);
        html = await res.text();
        cacheSet(path, html);
      }

      const doc = new DOMParser().parseFromString(html, "text/html");
      const newMain = doc.querySelector(".page-wrapper") || doc.querySelector("section");

      if (newMain) {
        mainSection.innerHTML = newMain.innerHTML;

        // 🔤 Re-run translations on injected content
        if (window.translatePage) window.translatePage(mainSection);

        if (push) {
          history.pushState({ html: newMain.innerHTML, href: path }, "", `${BASE}${path}`);
        }

        cleanupAnimations();
        runAnimations();
        runVantaEffect();

        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveLink(path);

        if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    } catch (err) {
      console.error(err);
      mainSection.innerHTML = "<p>Sorry, this page failed to load.</p>";
    } finally {
      navInFlight = false;
    }
  }

  // Prefetch internal pages on hover for instant navigation
  document.addEventListener("mouseover", async (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!isInternalHTML(href)) return;

    const path = normalize(href);
    if (pageCache.has(path)) return; // already cached

    const fetchURL = new URL(path, `${location.origin}${BASE}`).href;
    try {
      const res = await fetch(fetchURL, { cache: "no-cache" });
      if (res.ok) cacheSet(path, await res.text());
    } catch (_) {
      /* ignore prefetch errors */
    }
  });

  // Event delegation: intercept ALL internal links (header, footer, body)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (isInternalHTML(href)) {
      e.preventDefault();
      loadPage(href, true);
    }
  });

  // History back/forward
  window.addEventListener("popstate", (e) => {
    if (e.state?.href) {
      loadPage(e.state.href, false);
    } else {
      const path = normalize(location.pathname); // e.g., "pages/services.html"
      if (isInternalHTML(path)) loadPage(path, false);
    }
  });

  // Initial route:
  const initialPath = normalize(location.pathname);
  if (!initialPath || initialPath === "index.html") {
    loadPage("pages/home.html", false); // default to home
  } else if (isInternalHTML(initialPath)) {
    loadPage(initialPath, false); // deep link support
  }
});
