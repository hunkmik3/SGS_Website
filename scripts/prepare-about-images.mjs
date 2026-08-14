/**
 * Resizes the About collage stills.
 *   node scripts/prepare-about-images.mjs <top> <middle> <bottom>
 *
 * Sources are already 16:9 and already greyscale, so this only scales them
 * down — no crop, no desaturation.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT_DIR = new URL("../public/images/about/", import.meta.url).pathname;
const WIDTH = 1600; // ~2x the 821px the image occupies at a 1920 viewport

const slugs = ["human-craft", "ip-ownership", "speed-without-compromise"];

const sources = process.argv.slice(2);
if (sources.length !== slugs.length) {
  throw new Error(`Expected ${slugs.length} images, got ${sources.length}`);
}

await mkdir(OUT_DIR, { recursive: true });

for (const [i, src] of sources.entries()) {
  const dest = `${OUT_DIR}${slugs[i]}.jpg`;
  await sharp(src)
    .resize({ width: WIDTH })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
  const out = await sharp(dest).metadata();
  console.log(`${slugs[i]}.jpg  ${out.width}x${out.height}`);
}
