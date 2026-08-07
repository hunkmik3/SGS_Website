/**
 * Design-comparison screenshots.
 *   node scripts/shot.mjs <outDir> [width...]
 * Also reports document scrollWidth so horizontal overflow is caught early.
 */
import { chromium } from "playwright";

const [outDir = ".", ...widths] = process.argv.slice(2);
const sizes = (widths.length ? widths : ["1440", "390"]).map(Number);

// Drives the locally installed Google Chrome so no browser download is needed.
const browser = await chromium.launch({ channel: "chrome" });

for (const width of sizes) {
  const page = await browser.newPage({
    viewport: { width, height: width < 700 ? 780 : 900 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(30000);

  // Not networkidle: the dev server keeps an HMR socket open, so it never
  // settles and the whole run hangs.
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("footer");

  // Grow the viewport to the whole document instead of using `fullPage`.
  // Playwright's fullPage mode resizes and captures in one step, which can
  // catch large images mid-decode — a logo showed up half-painted that way.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width, height: Math.min(height, 20000) });

  // Everything is on screen now, but nudge the scroll so any whileInView
  // observers that keyed off the old viewport still fire.
  await page.evaluate(async () => {
    window.scrollTo(0, 1);
    await new Promise((r) => setTimeout(r, 150));
    window.scrollTo(0, 0);
  });

  // Wait for images to finish, but never block on one: decode() on a lazy
  // image that has not started loading never resolves.
  await page.evaluate(
    () =>
      Promise.race([
        Promise.all(
          [...document.images].map((i) =>
            i.complete ? i.decode().catch(() => {}) : Promise.resolve(),
          ),
        ),
        new Promise((r) => setTimeout(r, 3000)),
      ]),
  );
  await page.waitForTimeout(800);

  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));

  // Sticky headers paint at their scroll offset in a tall viewport; pin only
  // those back to flow. A blanket rule would break absolute card overlays.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("*")) {
      const pos = getComputedStyle(el).position;
      if (pos === "sticky" || pos === "fixed") el.style.position = "static";
    }
  });

  await page.screenshot({ path: `${outDir}/w-${width}.png` });
  console.log(
    `w-${width}.png  viewport=${overflow.client}  scrollWidth=${overflow.scroll}` +
      (overflow.scroll > overflow.client ? "  ⚠ HORIZONTAL OVERFLOW" : "  ok"),
  );
  await page.close();
}

await browser.close();
