/**
 * Trims the exported Figma icon glyphs and normalises them for the help cards.
 *   node scripts/prepare-icons.mjs <icon1> <icon2> <icon3> <icon4>
 * Arguments follow the card reading order (top-left, top-right, bottom-left,
 * bottom-right).
 *
 * The exports are single-colour cream glyphs on transparency with a lot of
 * surrounding padding, so each is trimmed to its own ink and then scaled to a
 * common optical box — otherwise the wide film glyph would read much larger
 * than the narrow slider glyph at the same nominal size.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT_DIR = new URL("../public/images/icons/", import.meta.url).pathname;
const BOX = 160; // 4x the ~40px the glyph occupies inside the 49px tile

const slugs = [
  "finished-production",
  "built-around-you",
  "craft-that-holds",
  "scale-on-demand",
];

const sources = process.argv.slice(2);
if (sources.length !== slugs.length) {
  throw new Error(`Expected ${slugs.length} icons, got ${sources.length}`);
}

await mkdir(OUT_DIR, { recursive: true });

for (const [i, src] of sources.entries()) {
  const trimmed = await sharp(src)
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });

  const dest = `${OUT_DIR}${slugs[i]}.png`;
  await sharp(trimmed.data)
    .resize({ width: BOX, height: BOX, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(dest);

  const ratio = (trimmed.info.width / trimmed.info.height).toFixed(3);
  console.log(`${slugs[i]}.png  trimmed ${trimmed.info.width}x${trimmed.info.height} (ratio ${ratio})`);
}
