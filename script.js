const prefersReducedMotionGlobal = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- AOS (scroll reveal) ----------
if (window.AOS) {
  AOS.init({
    duration: 700,
    easing: "ease-out-quad",
    once: true,
    offset: 60,
    disable: prefersReducedMotionGlobal,
  });
}

// ---------- Scroll progress bar ----------
const scrollProgress = document.getElementById("scrollProgress");
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + "%";
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

// ---------- Nav gains shadow after scrolling past hero ----------
const navEl = document.querySelector(".nav");
function updateNavState() {
  if (window.scrollY > 12) {
    navEl.classList.add("scrolled");
  } else {
    navEl.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", updateNavState, { passive: true });
updateNavState();

// ---------- Animated stat bars in the institutions section ----------
const teacherCard = document.getElementById("teacherCard");
if (teacherCard && "IntersectionObserver" in window) {
  let animated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          teacherCard.querySelectorAll(".weak-bar > div").forEach((bar) => {
            const target = bar.dataset.target;
            requestAnimationFrame(() => {
              bar.style.transition = "width 900ms ease-out";
              bar.style.width = target + "%";
            });
          });
          teacherCard.querySelectorAll(".pct").forEach((label) => {
            const target = parseInt(label.dataset.target, 10);
            const start = performance.now();
            const duration = 900;
            function tick(now) {
              const progress = Math.min((now - start) / duration, 1);
              label.textContent = Math.round(progress * target) + "%";
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(teacherCard);
}

// ---------- Subtle tilt on the hero/preview ledger cards ----------
if (!prefersReducedMotionGlobal) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    const maxTilt = 4;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
    });
  });
}

// ---------- Spring-pop icons on scroll ----------
if (!prefersReducedMotionGlobal && "IntersectionObserver" in window) {
  const icons = document.querySelectorAll(".icon-pop");
  const iconObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // small stagger so a row of icons doesn't pop in as one flat block
          const siblings = Array.from(entry.target.parentElement.parentElement.children);
          const indexInRow = siblings.indexOf(entry.target.parentElement);
          const delay = Math.max(indexInRow, 0) * 70;
          setTimeout(() => entry.target.classList.add("pop-in"), delay);
          iconObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  icons.forEach((icon) => iconObserver.observe(icon));
} else {
  document.querySelectorAll(".icon-pop").forEach((icon) => icon.classList.add("pop-in"));
}

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

navToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Hero mockup animation ----------
// Cycles through: no decision made -> price decision made -> restock flagged by the engine.
// Respects prefers-reduced-motion by settling on the final "diagnosed" state immediately.
const rowPrice = document.getElementById("rowPrice");
const rowRestock = document.getElementById("rowRestock");
const drPrice = document.getElementById("drPrice");
const crRestock = document.getElementById("crRestock");
const heroStatus = document.getElementById("heroStatus");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeroStage(stage) {
  if (stage >= 1) {
    rowPrice.classList.add("active");
    drPrice.textContent = "Done";
  } else {
    rowPrice.classList.remove("active");
    drPrice.textContent = "—";
  }

  if (stage >= 2) {
    rowRestock.classList.add("filled");
    crRestock.textContent = "Flagged";
    heroStatus.hidden = false;
  } else {
    rowRestock.classList.remove("filled");
    crRestock.textContent = "—";
    heroStatus.hidden = true;
  }
}

if (prefersReducedMotion) {
  setHeroStage(2);
} else {
  let stage = 0;
  setHeroStage(stage);
  setInterval(() => {
    stage = (stage + 1) % 3;
    setHeroStage(stage);
  }, 1800);
}

// ---------- Product preview: tappable decision options ----------
const previewOptions = document.getElementById("previewOptions");
const previewHint = document.getElementById("previewHint");

if (previewOptions) {
  const buttons = Array.from(previewOptions.querySelectorAll(".opt-btn"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";

      buttons.forEach((b) => b.classList.remove("picked-correct", "picked-wrong"));
      btn.classList.add(isCorrect ? "picked-correct" : "picked-wrong");

      if (isCorrect) {
        previewHint.textContent = "Sound call — you keep the sale and protect enough cash for this week's costs.";
      } else {
        previewHint.textContent = "Not quite. Weigh what this choice does to your cash position this week, not just this one sale.";
      }
    });
  });
}
