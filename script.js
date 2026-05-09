const header = document.querySelector("[data-header]");
const nav = document.querySelector("#site-nav");
const navToggle = document.querySelector(".nav-toggle");
const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

const closeNav = () => {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId === "#" ? null : document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    closeNav();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (!reduceMotion) {
  document.body.classList.add("reveal-ready");

  const revealItems = document.querySelectorAll(
    ".section-heading, .lead-text, .practice-note, .feature-card, .work-card, .case-card, .idea-strip, .list-panel, .mini-case, .compare-wrap, .timeline li, .boundary-box, .parent-guidance, .contact-card",
  );

  revealItems.forEach((item) => item.classList.add("reveal-item"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (hero && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        hero.style.setProperty("--cursor-x", `${x.toFixed(1)}%`);
        hero.style.setProperty("--cursor-y", `${y.toFixed(1)}%`);
      },
      { passive: true },
    );
  }

  if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.createElement("span");
    const trailDots = Array.from({ length: 8 }, () => document.createElement("span"));
    const cursor = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      dotX: window.innerWidth / 2,
      dotY: window.innerHeight / 2,
    };
    const trails = trailDots.map((_, index) => ({
      x: cursor.x,
      y: cursor.y,
      ease: 0.2 - index * 0.012,
    }));

    cursorDot.className = "cursor-dot";
    trailDots.forEach((dot, index) => {
      dot.className = "cursor-trail";
      dot.style.setProperty("--trail-opacity", String(0.28 - index * 0.025));
      dot.style.width = `${Math.max(2, 8 - index * 0.55)}px`;
      dot.style.height = `${Math.max(2, 8 - index * 0.55)}px`;
      document.body.appendChild(dot);
    });
    document.body.appendChild(cursorDot);
    document.body.classList.add("custom-cursor");

    const moveCursor = (event) => {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      document.body.classList.add("cursor-active");
    };

    const setInteractiveState = (event) => {
      const target = event.target;
      const isInteractive =
        target instanceof Element &&
        Boolean(target.closest("a, button, input, textarea, select, summary, [tabindex]"));

      document.body.classList.toggle("cursor-linking", isInteractive);
    };

    const animateCursor = () => {
      cursor.dotX += (cursor.x - cursor.dotX) * 0.34;
      cursor.dotY += (cursor.y - cursor.dotY) * 0.34;
      cursorDot.style.left = `${cursor.dotX}px`;
      cursorDot.style.top = `${cursor.dotY}px`;

      trails.forEach((trail, index) => {
        const leader = index === 0 ? cursor : trails[index - 1];
        trail.x += (leader.x - trail.x) * trail.ease;
        trail.y += (leader.y - trail.y) * trail.ease;
        trailDots[index].style.left = `${trail.x}px`;
        trailDots[index].style.top = `${trail.y}px`;
      });

      requestAnimationFrame(animateCursor);
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerover", setInteractiveState, { passive: true });
    window.addEventListener("pointerout", setInteractiveState, { passive: true });
    document.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-active", "cursor-linking");
    });
    animateCursor();
  }
}
