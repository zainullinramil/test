function getStoredTheme() {
  const theme = localStorage.getItem("theme");
  return theme === "light" || theme === "dark" ? theme : undefined;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  const toggle = document.getElementById("themeToggle");
  if (toggle instanceof HTMLButtonElement) {
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    toggle.textContent = theme === "dark" ? "Тёмная" : "Светлая";
  }
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored) {
    setTheme(stored);
    return;
  }

  const prefersDark =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initSmoothScroll() {
  // ponytail: без сложного роутера — просто прокрутка к якорям.
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  });
}

function initToTop() {
  const btn = document.getElementById("toTop");
  if (!(btn instanceof HTMLButtonElement)) return;

  const update = () => {
    const show = window.scrollY > 600;
    btn.dataset.show = show ? "true" : "false";
  };

  update();
  window.addEventListener("scroll", update, { passive: true });

  btn.addEventListener("click", () => {
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  });
}

function initActiveNav() {
  const links = Array.from(document.querySelectorAll('.nav a[href^="#"]')).filter(
    (a) => a instanceof HTMLAnchorElement,
  );
  const sections = links
    .map((a) => {
      const href = a.getAttribute("href");
      const id = href ? href.slice(1) : "";
      const el = id ? document.getElementById(id) : undefined;
      return el ? { id, link: a, el } : undefined;
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  const setCurrent = (id) => {
    for (const item of sections) {
      if (!item) continue;
      const isCurrent = item.id === id;
      if (isCurrent) item.link.setAttribute("aria-current", "page");
      else item.link.removeAttribute("aria-current");
    }
  };

  // ponytail: простое IntersectionObserver; если будет много секций — можно улучшить стратегию выбора.
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (!visible || !(visible.target instanceof HTMLElement)) return;
      setCurrent(visible.target.id);
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.2, 0.35, 0.5] },
  );

  for (const item of sections) {
    if (!item) continue;
    observer.observe(item.el);
  }
}

function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!(toggle instanceof HTMLButtonElement)) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "light" : "dark");
  });
}

initTheme();
initYear();
initThemeToggle();
initSmoothScroll();
initToTop();
initActiveNav();
