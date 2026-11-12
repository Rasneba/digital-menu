const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const DIST = path.join(__dirname, "dist");
const PORT = 4321;

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  let file = path.join(DIST, url === "/" ? "index.html" : url);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
  const ext = path.extname(file);
  res.setHeader("Content-Type", ext === ".html" ? "text/html" : "application/octet-stream");
  res.end(fs.readFileSync(file));
});

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch({
    executablePath:
      process.env.HOME + "/.cache/ms-playwright/chromium-1148/chrome-linux/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const errors = [];

  async function inspect(name, viewport, isMobile) {
    const ctx = await browser.newContext({ viewport, isMobile, hasTouch: isMobile, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[${name}] console: ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`[${name}] pageerror: ${e.message}`));

    await page.goto(`http://localhost:${PORT}/digital-menu`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);

    const geo = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".stf__item"));
      const visible = items
        .filter((el) => getComputedStyle(el).display !== "none")
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        });
      const block = document.querySelector(".stf__block");
      const parent = document.querySelector(".stf__parent");
      return {
        pageCount: items.length,
        visible,
        block: block ? { w: block.offsetWidth, h: block.offsetHeight } : null,
        parent: parent ? { w: parent.offsetWidth, h: parent.offsetHeight } : null,
        orientation: document.querySelector(".stf__wrapper").className,
        footer: document.querySelector("footer")?.innerText.replace(/\n+/g, " | "),
      };
    });
    console.log(`\n=== ${name} (${viewport.width}x${viewport.height}) ===`);
    console.log(JSON.stringify(geo, null, 1));

    await page.screenshot({ path: `shots/${name}-cover.png` });

    // open the menu from the cover
    const openBtn = page.locator('[data-action="open-menu"]');
    if (await openBtn.count()) {
      await openBtn.first().click({ force: true });
      await page.waitForTimeout(1600);
    }
    const afterOpen = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".stf__item"));
      const visible = items
        .filter((el) => getComputedStyle(el).display !== "none")
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        });
      return { visible, footer: document.querySelector("footer")?.innerText.replace(/\n+/g, " | ") };
    });
    console.log("after open:", JSON.stringify(afterOpen));
    await page.screenshot({ path: `shots/${name}-spread.png` });

    // next page
    await page.getByText("Next", { exact: true }).click().catch(() => {});
    await page.waitForTimeout(1500);
    const afterNext = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".stf__item"));
      const visible = items
        .filter((el) => getComputedStyle(el).display !== "none")
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
                   text: (el.innerText || "").slice(0, 60).replace(/\n+/g, " / ") };
        });
      return { visible, footer: document.querySelector("footer")?.innerText.replace(/\n+/g, " | ") };
    });
    console.log("after next:", JSON.stringify(afterNext));
    await page.screenshot({ path: `shots/${name}-next.png` });

    // open a photo (pick a visible one)
    const photo = page.locator("[data-photo-id]:visible").first();
    if (await photo.count()) {
      await photo.click({ force: true });
      await page.waitForTimeout(900);
      const viewer = await page.evaluate(() => {
        const el = document.querySelector("body > div.fixed");
        return el ? { present: true, text: el.innerText.slice(0, 120).replace(/\n+/g, " | ") } : { present: false };
      });
      console.log("viewer:", JSON.stringify(viewer));
      await page.screenshot({ path: `shots/${name}-viewer.png` });
    }

    await ctx.close();
  }

  await inspect("desktop", { width: 1440, height: 900 }, false);
  await inspect("mobile", { width: 390, height: 844 }, true);

  console.log("\n=== ERRORS ===");
  console.log(errors.length ? errors.join("\n") : "none");

  await browser.close();
  server.close();
})();
