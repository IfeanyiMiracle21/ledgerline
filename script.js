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
// Cycles through: nothing entered -> debit entered -> credit entered + balanced.
// Respects prefers-reduced-motion by settling on the final "balanced" state immediately.
const rowInventory = document.getElementById("rowInventory");
const rowPayables = document.getElementById("rowPayables");
const drInventory = document.getElementById("drInventory");
const crPayables = document.getElementById("crPayables");
const heroStatus = document.getElementById("heroStatus");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeroStage(stage) {
  if (stage >= 1) {
    rowInventory.classList.add("active");
    drInventory.textContent = "150,000";
  } else {
    rowInventory.classList.remove("active");
    drInventory.textContent = "—";
  }

  if (stage >= 2) {
    rowPayables.classList.add("filled");
    crPayables.textContent = "150,000";
    heroStatus.hidden = false;
  } else {
    rowPayables.classList.remove("filled");
    crPayables.textContent = "—";
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

// ---------- Product preview: tappable account options ----------
const previewOptions = document.getElementById("previewOptions");
const previewHint = document.getElementById("previewHint");

if (previewOptions) {
  const buttons = Array.from(previewOptions.querySelectorAll(".opt-btn"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";
      btn.classList.remove("picked-correct", "picked-wrong");
      btn.classList.add(isCorrect ? "picked-correct" : "picked-wrong");

      const allAnswered = buttons.every(
        (b) => b.classList.contains("picked-correct") || b.classList.contains("picked-wrong")
      );

      if (isCorrect) {
        previewHint.textContent = "Right — that account is affected by this transaction.";
      } else {
        previewHint.textContent = "Not this one. Think about what the business actually received or owes.";
      }

      if (allAnswered) {
        previewHint.textContent = "That's the full picture: Inventory and Payables are affected here.";
      }
    });
  });
}
