/**
 * Crops the work-strip source stills to the Figma card ratio.
 *   node scripts/prepare-work-images.mjs <img1> <img2> <img3> <img4>
 * Arguments are left-to-right in the strip.
 *
 * Sources are 9:16 (0.5625); cards are 186:277 (0.6716), so 16.2% of the
 * height is dropped. Gravity is per-image: `top` keeps a subject's head intact
 * when it already sits near the top edge, `centre` suits the rest.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT_DIR = new URL("../public/images/work/", import.meta.url).pathname;
const RATIO = 186 / 277;
const MAX_WIDTH = 960;

const targets = [
  { slug: "original-ip", gravity: "centre" },
  { slug: "anime-micro-drama", gravity: "centre" },
  { slug: "live-action-fantasy", gravity: "top" },
  { slug: "animation-music-video", gravity: "centre" },
];

const sources = process.argv.slice(2);
if (sources.length !== targets.length) {
  throw new Error(`Expected ${targets.length} source images, got ${sources.length}`);
}

await mkdir(OUT_DIR, { recursive: true });

for (const [i, src] of sources.entries()) {
  const { slug, gravity } = targets[i];
  const { width } = await sharp(src).metadata();

  const outWidth = Math.min(MAX_WIDTH, width);
  const outHeight = Math.round(outWidth / RATIO);
  const dest = `${OUT_DIR}${slug}.jpg`;

  await sharp(src)
    .resize({ width: outWidth, height: outHeight, fit: "cover", position: gravity })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);

  console.log(`${slug}.jpg  ${outWidth}x${outHeight}  gravity=${gravity}  (from ${width}px wide)`);
}
