/**
 * Resizes a transparent-background cutout for the web.
 *   node scripts/prepare-cutout.mjs <source.png> <slug> [width]
 *
 * Stays PNG rather than becoming JPEG: the alpha channel is the whole point of
 * a cutout, and JPEG has none. next/image re-encodes it to WebP or AVIF at
 * request time anyway, so the source only needs to be lossless and reasonable.
 */
import { mkdir, stat } from "node:fs/promises";
import sharp from "sharp";

const [src, slug, width = "1000"] = process.argv.slice(2);
if (!src || !slug) {
  throw new Error("usage: node scripts/prepare-cutout.mjs <source.png> <slug> [width]");
}

const OUT = new URL("../public/images/about/", import.meta.url).pathname;
await mkdir(OUT, { recursive: true });
const dest = `${OUT}${slug}.png`;

await sharp(src)
  // Trim first: any transparent margin would otherwise eat into the budget and
  // shift the subject off where the layout expects it.
  .trim({ threshold: 1 })
  .resize({ width: Number(width) })
  .png({ compressionLevel: 9 })
  .toFile(dest);

const out = await sharp(dest).metadata();
const kb = Math.round((await stat(dest)).size / 1024);
console.log(`${slug}.png  ${out.width}x${out.height}  ratio ${(out.width / out.height).toFixed(3)}  ${kb}KB`);
