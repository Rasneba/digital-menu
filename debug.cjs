const http = require("http"); const fs = require("fs"); const path = require("path");
const { chromium } = require("playwright-core");
const DIST = path.join(__dirname, "dist"); const PORT = 4322;
const server = http.createServer((req,res)=>{const u=req.url.split("?")[0];let f=path.join(DIST,u==="/"?"index.html":u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(DIST,"index.html");res.setHeader("Content-Type","text/html");res.end(fs.readFileSync(f));});
(async()=>{
  await new Promise(r=>server.listen(PORT,r));
  const b = await chromium.launch({executablePath:process.env.HOME+"/.cache/ms-playwright/chromium-1148/chrome-linux/chrome",args:["--no-sandbox"]});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  p.on("console", m=>console.log("CONSOLE", m.type(), m.text()));
  p.on("pageerror", e=>console.log("PAGEERROR", e.message, e.stack?.split("\n").slice(0,4).join(" | ")));
  await p.goto(`http://localhost:${PORT}/digital-menu`);
  await p.waitForTimeout(2500);
  console.log("BODY CLASSES:", await p.evaluate(()=>{
    const root = document.getElementById("root");
    return { html: root.innerHTML.slice(0,300), hasParent: !!document.querySelector(".stf__parent"), items: document.querySelectorAll(".stf__item").length, wrapper: !!document.querySelector(".stf__wrapper"), block: !!document.querySelector(".stf__block") };
  }));
  await b.close(); server.close();
})();
