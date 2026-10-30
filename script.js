// MOBILE NAVIGATION — Toggle the compact menu and close it after a visitor follows a link.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-header nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  navigation.classList.toggle("open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  });
});

// DYNAMIC COPYRIGHT YEAR — Keeps the footer year current without manual edits.
document.querySelector("#year").textContent = new Date().getFullYear();

// COMMUNITY DINOSAUR CLICKER — Connects the button, shared count, status text, and SVG reveal to the API route.
const dinoClicker = document.querySelector("#dino-clicker");
const communityCount = document.querySelector("#dino-counter-value");
const communityStatus = document.querySelector("#dino-counter-status");
const dinoProgress = document.querySelector("#dino-progress");
const dinoReveal = document.querySelector(".dino-reveal");
const communityTallyUrl = "/api/dino-clicks";
let totalClicks = null;
let localAnimationClicks = 0; // Keeps the color animation responsive when the shared counter is offline.

// COLOR PROGRESS — Reveals the SVG color layer in proportion to the first 20 community clicks.
function paintDinosaur(count, isLocalPreview = false) {
  const progress = Math.min(count / 20, 1);
  dinoClicker.style.setProperty("--fill-progress", progress);
  dinoClicker.style.setProperty("--sparkle-opacity", 0.22 + progress * 0.78);
  dinoReveal.setAttribute("width", String(progress * 480));
  dinoClicker.setAttribute(
    "aria-label",
    `Color in the dinosaur, ${Math.min(count, 20)} of 20 clicks${progress === 1 ? ", fully colored" : ""}`,
  );
  dinoProgress.textContent = progress === 1
    ? isLocalPreview
      ? "Preview complete — connect the tally to share it with everyone."
      : "The community brought this dinosaur to life!"
    : `${isLocalPreview ? "Local preview" : "Community color-in"}: ${count} of 20 clicks`;
}

// LOAD SHARED TALLY — Reads the current community total and restores the matching dinosaur color on page load.
async function loadCommunityClicks() {
  try {
    const response = await fetch(communityTallyUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Community tally is not configured");
    const data = await response.json();
    const loadedCount = Number(data.count);
    if (!Number.isFinite(loadedCount)) throw new Error("Invalid community tally");
    totalClicks = Math.max(totalClicks ?? 0, loadedCount);
    communityCount.textContent = totalClicks.toLocaleString();
    paintDinosaur(totalClicks);
    communityStatus.textContent = "";
  } catch {
    communityStatus.textContent = "Community tally is offline until its shared counter is connected.";
  }
}

// RECORD A CLICK — Animates immediately, posts one increment to the shared tally, then reconciles with the saved total.
dinoClicker.addEventListener("click", async () => {
  const previousCount = totalClicks;
  let optimisticCount;
  if (totalClicks === null) {
    optimisticCount = ++localAnimationClicks;
  } else {
    optimisticCount = ++totalClicks;
    communityCount.textContent = optimisticCount.toLocaleString();
  }
  paintDinosaur(optimisticCount, previousCount === null);
  dinoClicker.classList.add("is-clicked");
  window.setTimeout(() => dinoClicker.classList.remove("is-clicked"), 160);

  try {
    const response = await fetch(communityTallyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (!response.ok) throw new Error("Community tally is not configured");
    const data = await response.json();
    const serverCount = Number(data.count);
    if (!Number.isFinite(serverCount)) throw new Error("Invalid community tally");
    totalClicks = Math.max(totalClicks ?? 0, serverCount);
    localAnimationClicks = 0;
    communityCount.textContent = totalClicks.toLocaleString();
    paintDinosaur(totalClicks);
    communityStatus.textContent = "";
  } catch {
    if (previousCount !== null) {
      totalClicks = previousCount;
      communityCount.textContent = totalClicks.toLocaleString();
      paintDinosaur(totalClicks);
    } else {
      communityCount.textContent = "—";
    }
    communityStatus.textContent = "Click couldn’t reach the shared tally. Try again when it’s online.";
  }
});

loadCommunityClicks();

// WORD THREAD — Fit real-sized type to a responsive curve, then reveal each word once.
const wordThread = document.querySelector(".word-thread");
if (wordThread) {
  const svg = wordThread.querySelector("svg");
  const path = svg.querySelector("path");
  const svgNamespace = "http://www.w3.org/2000/svg";
  const words = ["CREATE", "EXPLORE", "DESIGN", "IMAGINE", "BUILD", "DISCOVER"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let observer;
  let frame;

  function layoutWordThread() {
    observer?.disconnect();
    const { width, height } = wordThread.getBoundingClientRect();
    if (!width || !height) return;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    // Scale the curve, keeping the type size and letter spacing independent of it.
    const point = (x, y) => `${width * x / 400} ${height * y / 1400}`;
    path.setAttribute("d", `M ${point(200, 12)} C ${point(350, 150)}, ${point(50, 250)}, ${point(100, 400)} S ${point(350, 600)}, ${point(200, 750)} S ${point(50, 950)}, ${point(200, 1100)} S ${point(350, 1250)}, ${point(200, 1388)}`);
    svg.querySelectorAll("text").forEach((text) => text.remove());
    const pathLength = path.getTotalLength();
    let offset = 12;
    let index = 0;
    while (offset < pathLength) {
      const text = document.createElementNS(svgNamespace, "text");
      text.classList.add("thread-word");
      const textPath = document.createElementNS(svgNamespace, "textPath");
      textPath.setAttribute("href", "#wordPath");
      textPath.setAttribute("startOffset", String(offset));
      textPath.textContent = `${words[index % words.length]} •`;
      text.append(textPath);
      svg.append(text);
      const length = text.getComputedTextLength();
      if (length <= 0 || offset + length > pathLength - 12) {
        text.remove();
        break;
      }
      offset += length + 20;
      index += 1;
    }

    const elements = svg.querySelectorAll(".thread-word");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      wordThread.classList.remove("is-ready");
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    wordThread.classList.add("is-ready");
    elements.forEach((element) => observer.observe(element));
  }

  function scheduleThreadLayout() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(layoutWordThread);
  }
  // Wait for DM Mono so word measurements include the final font metrics.
  document.fonts.ready.then(scheduleThreadLayout);
  if ("ResizeObserver" in window) {
    new ResizeObserver(scheduleThreadLayout).observe(wordThread);
  } else {
    window.addEventListener("resize", scheduleThreadLayout);
  }
  reducedMotion.addEventListener("change", scheduleThreadLayout);
}
