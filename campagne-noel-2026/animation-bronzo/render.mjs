// Rendu image par image de index.html vers MP4 (et images fixes de contrôle).
// Usage : node render.mjs            → toutes les vidéos dans export/
//         node render.mjs short      → seulement les versions 6 s
//         node render.mjs stills     → planches de contrôle dans export/stills/
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

// playwright local si installé, sinon l'installation globale
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); }
catch { pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright")); }
const { chromium } = pw;

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, "export");
const FPS = 30;
const FORMATS = [
  { name: "9x16", w: 1080, h: 1920 },
  { name: "1x1", w: 1080, h: 1080 },
  { name: "16x9", w: 1920, h: 1080 },
];
const ONLY = process.argv[2] === "short" ? "short" : null;
const JOBS = [
  ...FORMATS.map(f => ({ ...f, mode: "long" })),
  { ...FORMATS[0], mode: "short" },
  { ...FORMATS[1], mode: "short" },
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

async function open({ w, h, mode }) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`file://${DIR}/index.html?w=${w}&h=${h}&mode=${mode}&play=0`);
  await page.waitForFunction(() => window.ready);
  return page;
}

async function stills() {
  const dir = path.join(OUT, "stills");
  mkdirSync(dir, { recursive: true });
  const times = [1.2, 2.2, 4.0, 6.8, 9.8, 13.8, 17.2, 19.9];
  await Promise.all(FORMATS.map(async f => {
    const page = await open({ ...f, mode: "long" });
    for (const t of times) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(dir, `${f.name}-${String(t).replace(".", "_")}.jpg`), type: "jpeg", quality: 80 });
    }
    await page.close();
  }));
}

async function video(job) {
  const page = await open(job);
  const dur = await page.evaluate(() => window.DURATION);
  const name = `bronzo-${job.mode === "short" ? "6s" : "20s"}-${job.name}.mp4`;
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(OUT, name)],
    { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", c => c ? rej(new Error(`ffmpeg ${c}`)) : res()));
  for (let i = 0; i < dur * FPS; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await done;
  await page.close();
  console.log("ok", name);
}

mkdirSync(OUT, { recursive: true });
if (process.argv[2] === "stills") await stills();
else await Promise.all(JOBS.filter(j => !ONLY || j.mode === ONLY).map(video));
await browser.close();
